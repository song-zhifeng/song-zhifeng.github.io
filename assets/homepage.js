(() => {
  'use strict';
  const key = 'zhifeng-home-language';
  const titles = {
    'zh-CN': '宋智峰 | 工业工程 · 质量 · 供应链',
    en: 'Zhifeng Song | Industrial Engineering, Quality & Supply Chain'
  };
  const descriptions = {
    'zh-CN': '宋智峰的中英文求职主页。墨尔本大学工业工程硕士在读，展示装配、质量分析、工业仿真、供应链及 Capstone 工程项目。',
    en: 'Bilingual career portfolio of Zhifeng Song, Industrial Engineering master’s candidate at the University of Melbourne. Assembly, quality, simulation, supply chain and field engineering projects.'
  };
  function selectedLanguage() {
    const query = new URLSearchParams(location.search).get('lang');
    if (query === 'en') return 'en';
    if (query === 'zh' || query === 'zh-CN') return 'zh-CN';
    try { if (localStorage.getItem(key) === 'en') return 'en'; } catch (_) {}
    return 'zh-CN';
  }
  function setLanguage(language, updateURL = false, announce = false) {
    const lang = language === 'en' ? 'en' : 'zh-CN';
    document.documentElement.lang = lang;
    document.title = titles[lang];
    document.querySelector('meta[name="description"]').content = descriptions[lang];
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === lang));
    });
    document.querySelectorAll('[data-alt-en]').forEach(img => {
      img.alt = lang === 'en' ? img.dataset.altEn : img.dataset.altZh;
    });
    document.querySelectorAll('[data-label-en]').forEach(element => {
      element.setAttribute('aria-label', lang === 'en' ? element.dataset.labelEn : element.dataset.labelZh);
    });
    document.querySelectorAll('a[href^="portfolio.html"]').forEach(link => {
      const url = new URL(link.getAttribute('href'), document.baseURI);
      url.searchParams.set('lang', lang === 'en' ? 'en' : 'zh');
      link.href = 'portfolio.html' + url.search + url.hash;
    });
    try { localStorage.setItem(key, lang); } catch (_) {}
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('lang', lang === 'en' ? 'en' : 'zh');
      try { history.replaceState(null, '', url); } catch (_) {}
    }
    if (announce) document.getElementById('language-status').textContent = lang === 'en' ? 'English selected.' : '已切换为中文。';
  }
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.language, true, true));
  });
  window.addEventListener('popstate', () => setLanguage(selectedLanguage()));
  setLanguage(selectedLanguage());
  // Keep links from the earlier portfolio and submitted applications working.
  const oldCaseIDs = ['assembly','quality','beverage','dfm','design','capstone','lca','kfc','toyota','plc','reports'];
  if (oldCaseIDs.includes(location.hash.slice(1))) {
    location.replace(new URL('portfolio.html?lang=' + (selectedLanguage() === 'en' ? 'en' : 'zh') + location.hash, document.baseURI).href);
  } else {
    const aliases = { directory: 'projects', overview: 'top', profile: 'experience' };
    const alias = aliases[location.hash.slice(1)];
    if (alias) document.getElementById(alias)?.scrollIntoView();
  }
})();
