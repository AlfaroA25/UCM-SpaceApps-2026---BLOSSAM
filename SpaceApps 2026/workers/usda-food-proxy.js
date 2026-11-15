const USDA_ENDPOINT = 'https://api.nal.usda.gov/fdc/v1';
const MAX_SEARCH_LENGTH = 100;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

const nutrientDefinitions = [
  { key: 'calories', ids: new Set(['1008', '208']), names: ['energy'] },
  { key: 'protein', ids: new Set(['1003']), names: ['protein'] },
  { key: 'carbohydrates', ids: new Set(['1005']), names: ['carbohydrate, by difference', 'carbohydrate'] },
  { key: 'fat', ids: new Set(['1004']), names: ['total lipid (fat)', 'total fat'] },
  { key: 'fiber', ids: new Set(['1079']), names: ['fiber, total dietary', 'dietary fiber'] },
  { key: 'sugar', ids: new Set(['2000', '1063']), names: ['sugars, total including nlea', 'total sugars', 'sugars, total'] },
  { key: 'sodium', ids: new Set(['1093']), names: ['sodium, na'] }
];

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
  });
}

function corsHeaders(origin, allowedOrigins) {
  if (!origin || !allowedOrigins.has(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin'
  };
}

function extractNutrients(rows = []) {
  const result = Object.fromEntries(nutrientDefinitions.map(({ key }) => [key, null]));
  for (const row of rows) {
    const nutrient = row.nutrient || row;
    const id = String(nutrient.id ?? nutrient.nutrientId ?? nutrient.number ?? nutrient.nutrientNumber ?? '');
    const name = String(nutrient.name ?? nutrient.nutrientName ?? '').trim().toLowerCase();
    const rawValue = row.amount ?? row.value;
    if (rawValue === null || rawValue === undefined || !Number.isFinite(Number(rawValue))) continue;
    const definition = nutrientDefinitions.find((item) => item.ids.has(id) || item.names.includes(name));
    if (!definition || result[definition.key] !== null) continue;
    let value = Number(rawValue);
    const unit = String(nutrient.unitName ?? row.unitName ?? '').toLowerCase();
    if (definition.key === 'sodium' && unit === 'g') value *= 1000;
    if (definition.key === 'calories' && unit === 'kj') value /= 4.184;
    result[definition.key] = value;
  }
  return result;
}

function normalizeFood(food) {
  const branded = String(food.dataType || '').toLowerCase() === 'branded';
  const servingSize = Number(food.servingSize);
  const servingUnit = String(food.servingSizeUnit || '').trim();
  const hasGramServing = branded && servingSize > 0 && /^g(rams?)?$/i.test(servingUnit);
  const basisAmount = branded ? (servingSize > 0 ? servingSize : 100) : 100;
  const basisUnit = branded && !hasGramServing && servingUnit ? servingUnit : 'g';
  const nutrients = extractNutrients(food.foodNutrients);
  const servings = [];

  if (hasGramServing) {
    servings.push({ label: `${servingSize} g · package serving`, multiplier: 1 });
    servings.push({ label: '100 g', multiplier: 100 / basisAmount });
    for (const portion of food.foodPortions || []) {
      const grams = Number(portion.gramWeight);
      if (!(grams > 0)) continue;
      const amount = Number(portion.amount);
      const modifier = String(portion.modifier || portion.portionDescription || '').trim();
      const label = modifier ? `${amount > 0 ? `${amount} ` : ''}${modifier} (${grams} g)` : `${grams} g portion`;
      if (!servings.some((serving) => serving.label === label)) {
        servings.push({ label, multiplier: grams / basisAmount });
      }
    }
  } else if (!branded) {
    servings.push({ label: '100 g', multiplier: 1 });
    for (const portion of food.foodPortions || []) {
      const grams = Number(portion.gramWeight);
      if (!(grams > 0)) continue;
      const amount = Number(portion.amount);
      const modifier = String(portion.modifier || portion.portionDescription || '').trim();
      const label = modifier ? `${amount > 0 ? `${amount} ` : ''}${modifier} (${grams} g)` : `${grams} g portion`;
      if (!servings.some((serving) => serving.label === label)) {
        servings.push({ label, multiplier: grams / 100 });
      }
    }
  } else {
    const label = servingSize > 0 && servingUnit
      ? `${servingSize} ${servingUnit} · package serving`
      : '1 USDA serving';
    servings.push({ label, multiplier: 1 });
  }

  return {
    id: String(food.fdcId),
    name: String(food.description || 'Unnamed food').slice(0, 240),
    brand: String(food.brandOwner || food.brandName || '').slice(0, 120),
    dataType: String(food.dataType || ''),
    nutrients,
    basisAmount,
    basisUnit,
    servings
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = new Set(String(env.ALLOWED_ORIGINS || 'https://alfaroa25.github.io,http://localhost:8000,http://127.0.0.1:8000')
      .split(',').map((value) => value.trim()).filter(Boolean));
    const cors = corsHeaders(origin, allowedOrigins);
    if (origin && !allowedOrigins.has(origin)) return jsonResponse({ error: 'Origin is not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return jsonResponse({ error: 'Only GET requests are supported.' }, 405, cors);
    if (!env.USDA_API_KEY) return jsonResponse({ error: 'The USDA_API_KEY Worker secret is not configured.' }, 503, cors);

    const url = new URL(request.url);
    if (url.pathname !== '/api/foods/search') return jsonResponse({ error: 'Route not found.' }, 404, cors);
    const query = String(url.searchParams.get('q') || '').trim();
    if (query.length < 2 || query.length > MAX_SEARCH_LENGTH) {
      return jsonResponse({ error: 'Search text must be between 2 and 100 characters.' }, 400, cors);
    }
    const rawPageSize = url.searchParams.get('pageSize');
    const requestedSize = rawPageSize === null ? DEFAULT_PAGE_SIZE : Number(rawPageSize);
    const pageSize = Number.isInteger(requestedSize)
      ? Math.min(MAX_PAGE_SIZE, Math.max(1, requestedSize))
      : DEFAULT_PAGE_SIZE;
    const upstreamUrl = new URL(`${USDA_ENDPOINT}/foods/search`);
    upstreamUrl.searchParams.set('api_key', env.USDA_API_KEY);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const upstream = await fetch(upstreamUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ query, pageSize }),
        signal: controller.signal
      });
      if (!upstream.ok) {
        return jsonResponse({ error: `USDA FoodData Central returned HTTP ${upstream.status}.` }, 502, cors);
      }
      const payload = await upstream.json();
      const foods = Array.isArray(payload.foods) ? payload.foods.map(normalizeFood) : [];
      return jsonResponse({ foods }, 200, cors);
    } catch (error) {
      const message = error?.name === 'AbortError' ? 'USDA search timed out.' : 'Unable to reach USDA FoodData Central.';
      return jsonResponse({ error: message }, 502, cors);
    } finally {
      clearTimeout(timeout);
    }
  }
};
