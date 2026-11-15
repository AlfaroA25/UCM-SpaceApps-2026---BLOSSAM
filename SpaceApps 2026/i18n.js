(() => {
  const catalogs = window.RUFUS_I18N_DATA;
  if (!catalogs) throw new Error('The AstroVital translation catalog did not load.');

  const brandingTranslations = {
    es: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Tu salud. Tu misión.',
      'Rufus, your AI health companion.': 'Rufus, tu compañero de salud con IA.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Conoce a Rufus, tu guía personalizada dentro de AstroVital.',
      'Chat with Rufus': 'Chatea con Rufus',
      'Customize Rufus': 'Personaliza a Rufus',
      'Tap Rufus to say hi': 'Toca a Rufus para saludar',
      'Rufus companion': 'Compañero Rufus',
      'Rufus companion bay': 'Bahía de Rufus',
      'Rufus avatar bay': 'Bahía del avatar de Rufus',
      'Install AstroVital': 'Instalar AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital se abre como una aplicación y mantiene tu perfil en este dispositivo.',
      'Rufus is happy you dropped by': 'A Rufus le alegra que hayas venido',
      'Rufus has a message for you': 'Rufus tiene un mensaje para ti',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital ofrece herramientas de bienestar, no diagnósticos médicos. Siga las indicaciones médicas de su misión.',
      'Try AstroVital, the local-first astronaut health app.': 'Prueba AstroVital, la aplicación local de salud para astronautas.'
    },
    fr: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Votre santé. Votre mission.',
      'Rufus, your AI health companion.': 'Rufus, votre compagnon de santé IA.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Découvrez Rufus, votre guide personnalisé au sein d’AstroVital.',
      'Chat with Rufus': 'Discuter avec Rufus',
      'Customize Rufus': 'Personnaliser Rufus',
      'Tap Rufus to say hi': 'Touchez Rufus pour le saluer',
      'Rufus companion': 'Compagnon Rufus',
      'Rufus companion bay': 'Espace compagnon de Rufus',
      'Rufus avatar bay': 'Espace avatar de Rufus',
      'Install AstroVital': 'Installer AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital s’ouvre comme une application et conserve votre profil sur cet appareil.',
      'Rufus is happy you dropped by': 'Rufus est ravi de votre visite',
      'Rufus has a message for you': 'Rufus a un message pour vous',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital propose des outils de bien-être, pas des diagnostics médicaux. Suivez les consignes médicales de votre mission.',
      'Try AstroVital, the local-first astronaut health app.': 'Découvrez AstroVital, l’application locale de santé pour les astronautes.'
    },
    de: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Ihre Gesundheit. Ihre Mission.',
      'Rufus, your AI health companion.': 'Rufus, dein KI-Gesundheitsbegleiter.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Lerne Rufus kennen, deinen persönlichen Wegbegleiter in AstroVital.',
      'Chat with Rufus': 'Mit Rufus chatten',
      'Customize Rufus': 'Rufus anpassen',
      'Tap Rufus to say hi': 'Tippe auf Rufus, um Hallo zu sagen',
      'Rufus companion': 'Rufus’ Begleiter',
      'Rufus companion bay': 'Rufus’ Begleiterbereich',
      'Rufus avatar bay': 'Rufus’ Avatar-Bereich',
      'Install AstroVital': 'AstroVital installieren',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital öffnet sich wie eine App und speichert dein Profil auf diesem Gerät.',
      'Rufus is happy you dropped by': 'Rufus freut sich über deinen Besuch',
      'Rufus has a message for you': 'Rufus hat eine Nachricht für dich',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital bietet Wellness-Werkzeuge, keine medizinischen Diagnosen. Befolge die medizinischen Vorgaben deiner Mission.',
      'Try AstroVital, the local-first astronaut health app.': 'Entdecke AstroVital, die lokale Gesundheits-App für Astronautinnen und Astronauten.'
    },
    zh: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — 您的健康，您的使命。',
      'Rufus, your AI health companion.': 'Rufus，您的 AI 健康伙伴。',
      'Meet Rufus, your personalized guide within AstroVital.': '认识 Rufus：他是 AstroVital 中为您提供个性化引导的伙伴。',
      'Chat with Rufus': '与 Rufus 聊天',
      'Customize Rufus': '自定义 Rufus',
      'Tap Rufus to say hi': '点击 Rufus 打个招呼',
      'Rufus companion': 'Rufus 伙伴',
      'Rufus companion bay': 'Rufus 伙伴舱',
      'Rufus avatar bay': 'Rufus 头像舱',
      'Install AstroVital': '安装 AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital 可像应用一样打开，并将您的个人资料保存在此设备上。',
      'Rufus is happy you dropped by': 'Rufus 很高兴你来访',
      'Rufus has a message for you': 'Rufus 有话想对你说',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital 提供健康支持工具，不提供医疗诊断。请遵循任务医疗指导。',
      'Try AstroVital, the local-first astronaut health app.': '体验 AstroVital：这款本地运行的宇航员健康应用。'
    },
    ja: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — あなたの健康、あなたのミッション。',
      'Rufus, your AI health companion.': 'Rufus、あなたのAIヘルスコンパニオンです。',
      'Meet Rufus, your personalized guide within AstroVital.': 'AstroVitalの中であなたを個別にサポートするガイド、Rufusをご紹介します。',
      'Chat with Rufus': 'Rufusとチャットする',
      'Customize Rufus': 'Rufusをカスタマイズ',
      'Tap Rufus to say hi': 'Rufusをタップして挨拶しましょう',
      'Rufus companion': 'Rufusのコンパニオン',
      'Rufus companion bay': 'Rufusのコンパニオンベイ',
      'Rufus avatar bay': 'Rufusのアバターベイ',
      'Install AstroVital': 'AstroVitalをインストール',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVitalはアプリのように起動し、プロフィールをこの端末に保存します。',
      'Rufus is happy you dropped by': 'Rufusは来てくれてうれしいです',
      'Rufus has a message for you': 'Rufusからメッセージがあります',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVitalは健康を支援するツールであり、医療診断は行いません。ミッションの医療指針に従ってください。',
      'Try AstroVital, the local-first astronaut health app.': 'ローカルで使える宇宙飛行士向け健康アプリ、AstroVitalをお試しください。'
    },
    ar: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — صحتك، مهمتك.',
      'Rufus, your AI health companion.': 'Rufus، رفيقك الصحي بالذكاء الاصطناعي.',
      'Meet Rufus, your personalized guide within AstroVital.': 'تعرّف على Rufus، دليلك الشخصي داخل AstroVital.',
      'Chat with Rufus': 'تحدث مع Rufus',
      'Customize Rufus': 'خصص Rufus',
      'Tap Rufus to say hi': 'اضغط على Rufus لإلقاء التحية',
      'Rufus companion': 'رفيق Rufus',
      'Rufus companion bay': 'مساحة Rufus المرافقة',
      'Rufus avatar bay': 'مساحة صورة Rufus الرمزية',
      'Install AstroVital': 'تثبيت AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'يفتح AstroVital كتطبيق ويحفظ ملفك الشخصي على هذا الجهاز.',
      'Rufus is happy you dropped by': 'يسعد Rufus بزيارتك',
      'Rufus has a message for you': 'لدى Rufus رسالة لك',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'يوفر AstroVital أدوات للعافية، وليس تشخيصًا طبيًا. اتبع الإرشادات الطبية للمهمة.',
      'Try AstroVital, the local-first astronaut health app.': 'جرّب AstroVital، تطبيق صحة رواد الفضاء الذي يعمل محليًا.'
    }
  };
  for (const [language, translations] of Object.entries(brandingTranslations)) {
    Object.assign(catalogs[language], translations);
  }

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
    const exactCatalog = getExactCatalog(locale);
    const brandNames = normalized.match(/\b(?:AstroVital|Rufus)\b/gi) || [];
    const candidates = [normalized];
    if (brandNames.length === 1) {
      candidates.push(normalized.replace(/\b(?:AstroVital|Rufus)\b/gi, 'RUFUS'));
    }
    for (const candidate of candidates) {
      const exact = exactCatalog.get(candidate);
      if (exact !== undefined) return `${leading}${normalizeBrandName(exact, normalized)}${trailing}`;
      for (const entry of getPatternCatalog(locale)) {
        const match = candidate.match(entry.expression);
        if (!match) continue;
        let output = entry.translated;
        entry.variables.forEach((variable, index) => {
          const value = match[index + 1];
          const translatedValue = value === 'start' || value === 'end'
            ? exactCatalog.get(value) || value
            : value;
          output = output.replaceAll(`__RUFUS_VAR_${variable}__`, translatedValue);
        });
        return `${leading}${normalizeBrandName(output, normalized)}${trailing}`;
      }
    }
    return source;
  }

  function normalizeBrandName(value, source) {
    const hasAstroVital = /\bAstroVital\b/i.test(source);
    const hasRufus = /\bRufus\b/i.test(source);
    if (hasAstroVital === hasRufus) return value;
    const name = hasAstroVital ? 'AstroVital' : 'Rufus';
    return value
      .replace(/\b(?:ASTROVITAL|RUFUS|RUFO)\b/gi, name)
      .replace(/鲁弗斯|ルーファス|روفوس/g, name);
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
      throw new RangeError(`Unsupported AstroVital language: ${nextLocale}`);
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
