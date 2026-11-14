(() => {
  const catalogs = window.RUFUS_I18N_DATA;
  if (!catalogs) throw new Error('The RUFUS translation catalog did not load.');

  const supportedLocales = new Set(['en', ...Object.keys(catalogs)]);
  const textSource = new WeakMap();
  const textOutput = new WeakMap();
  const attributeState = new WeakMap();
  const localizedAttributes = ['placeholder', 'title', 'aria-label', 'alt'];
  const exactCatalogs = new Map();
  const patternCatalogs = new Map();
  let locale = 'en';

  function getExactCatalog(language) {
    if (!exactCatalogs.has(language)) {
      exactCatalogs.set(language, new Map(Object.entries(catalogs[language] || {})));
    }
    return exactCatalogs.get(language);
  }

  function getPatternCatalog(language) {
    if (!patternCatalogs.has(language)) {
      const entries = [];
      for (const [source, translated] of Object.entries(catalogs[language] || {})) {
        const variables = [...source.matchAll(/__RUFUS_VAR_(\d+)__/g)].map((match) => match[1]);
        if (!variables.length) continue;
        const specificity = source.replace(/__RUFUS_VAR_\d+__/g, '')
          .replace(/[^A-Za-z\u00c0-\u024f\u4e00-\u9fff\u3040-\u30ff\u0600-\u06ff]/g, '').length;
        if (specificity < 2) continue;
        const parts = source.split(/__RUFUS_VAR_\d+__/g).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const expression = new RegExp(`^${parts.join('([\\s\\S]*?)')}$`);
        entries.push({ source, translated, variables, expression, specificity });
      }
      entries.sort((a, b) => b.specificity - a.specificity || b.source.length - a.source.length);
      patternCatalogs.set(language, entries);
    }
    return patternCatalogs.get(language);
  }

  function translate(source) {
    if (locale === 'en') return source;
    const leading = source.match(/^\s*/)[0];
    const trailing = source.match(/\s*$/)[0];
    const normalized = source.trim().replace(/\s+/g, ' ');
    const exact = getExactCatalog(locale).get(normalized);
    if (exact !== undefined) return `${leading}${exact}${trailing}`;
    for (const entry of getPatternCatalog(locale)) {
      const match = normalized.match(entry.expression);
      if (!match) continue;
      let output = entry.translated;
      entry.variables.forEach((variable, index) => {
        const value = match[index + 1];
        const translatedValue = value === 'start' || value === 'end'
          ? getExactCatalog(locale).get(value) || value
          : value;
        output = output.replaceAll(`__RUFUS_VAR_${variable}__`, translatedValue);
      });
      return `${leading}${output}${trailing}`;
    }
    return source;
  }

  function canTranslateNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,noscript,textarea,code,pre,[data-user-content]')) return false;
    return true;
  }

  function localizeTextNode(node) {
    if (!canTranslateNode(node)) return;
    const current = node.nodeValue;
    const previousOutput = textOutput.get(node);
    const source = previousOutput === current ? textSource.get(node) : current;
    textSource.set(node, source);
    const output = translate(source);
    if (output !== current) {
      textOutput.set(node, output);
      node.nodeValue = output;
    } else {
      textOutput.set(node, current);
    }
  }

  function localizeAttribute(element, attribute) {
    if (attribute === 'content' && !element.matches('meta[name="description"],meta[property="og:description"]')) return;
    const current = element.getAttribute(attribute);
    if (current === null) return;
    let attributes = attributeState.get(element);
    if (!attributes) {
      attributes = new Map();
      attributeState.set(element, attributes);
    }
    const previous = attributes.get(attribute);
    const source = previous && previous.output === current ? previous.source : current;
    const output = translate(source);
    attributes.set(attribute, { source, output });
    if (output !== current) element.setAttribute(attribute, output);
  }

  function localizeElement(element) {
    const attributes = element.matches('meta[name="description"],meta[property="og:description"]')
      ? [...localizedAttributes, 'content']
      : localizedAttributes;
    for (const attribute of attributes) {
      localizeAttribute(element, attribute);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) localizeTextNode(node);
    for (const descendant of element.querySelectorAll('*')) {
      const descendantAttributes = descendant.matches('meta[name="description"],meta[property="og:description"]')
        ? [...localizedAttributes, 'content']
        : localizedAttributes;
      for (const attribute of descendantAttributes) {
        localizeAttribute(descendant, attribute);
      }
    }
  }

  function setLocale(nextLocale) {
    if (!supportedLocales.has(nextLocale)) {
      throw new RangeError(`Unsupported RUFUS language: ${nextLocale}`);
    }
    locale = nextLocale;
    document.documentElement.lang = nextLocale === 'zh' ? 'zh-Hans' : nextLocale;
    document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
    localizeElement(document.documentElement);
    document.dispatchEvent(new CustomEvent('rufus:localechange', { detail: { locale } }));
  }

  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      if (change.type === 'characterData') {
        localizeTextNode(change.target);
      } else if (change.type === 'attributes') {
        localizeAttribute(change.target, change.attributeName);
      } else {
        for (const node of change.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) localizeTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) localizeElement(node);
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...localizedAttributes, 'content']
  });

  window.RufusI18n = Object.freeze({
    get locale() { return locale; },
    get localeTag() {
      return ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN', ja: 'ja-JP', ar: 'ar' })[locale];
    },
    setLocale,
    translate
  });
})();
