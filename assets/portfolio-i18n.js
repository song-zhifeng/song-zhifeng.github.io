(() => {
  'use strict';
  const dictionary = window.PORTFOLIO_EN || {};
  const key = 'zhifeng-home-language';
  const originalText = new WeakMap();
  const textRecords = [];
  const attributeRecords = [];
  const dynamic = '#reading-mode, #toggle-details, #filter-status, #reader-name, #toast, #language-status, #lightbox-caption';
  function translated(text) {
    if (Object.prototype.hasOwnProperty.call(dictionary, text)) return dictionary[text];
    const trimmed = text.trim();
    return Object.prototype.hasOwnProperty.call(dictionary, trimmed)
      ? text.replace(trimmed, dictionary[trimmed]) : text;
  }
  function walkText(root, visit) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.parentElement?.closest('script,style,noscript,[data-language]')) visit(node);
    }
  }
  walkText(document.documentElement, node => {
    if (node.parentElement.closest(dynamic)) return;
    const zh = node.nodeValue;
    const en = translated(zh);
    originalText.set(node, zh);
    if (en !== zh) textRecords.push({node, zh, en});
  });
  document.querySelectorAll('[alt],[aria-label],[placeholder],[title],meta[name="description"]').forEach(element => {
    if (element.matches('[data-language]')) return;
    for (const name of ['alt', 'aria-label', 'placeholder', 'title', 'content']) {
      const zh = element.getAttribute(name);
      if (zh !== null && translated(zh) !== zh) attributeRecords.push({element, name, zh, en: translated(zh)});
    }
  });
  function selectedLanguage() {
    const query = new URLSearchParams(location.search).get('lang');
    if (query === 'en') return 'en';
    if (query === 'zh' || query === 'zh-CN') return 'zh-CN';
    try { if (localStorage.getItem(key) === 'en') return 'en'; } catch (_) {}
    return 'zh-CN';
  }
  function setLanguage(language, updateURL = false, announce = false) {
    const lang = language === 'en' ? 'en' : 'zh-CN';
    const english = lang === 'en';
    document.documentElement.lang = lang;
    textRecords.forEach(({node, zh, en}) => { node.nodeValue = english ? en : zh; });
    attributeRecords.forEach(({element, name, zh, en}) => element.setAttribute(name, english ? en : zh));
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    document.querySelectorAll('a[data-home-link]').forEach(link => {
      const url = new URL(link.getAttribute('href'), document.baseURI);
      url.searchParams.set('lang', english ? 'en' : 'zh');
      link.href = url.pathname.split('/').pop() + url.search + url.hash;
    });
    try { localStorage.setItem(key, lang); } catch (_) {}
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('lang', english ? 'en' : 'zh');
      try { history.replaceState(null, '', url); } catch (_) {}
    }
    document.dispatchEvent(new CustomEvent('portfolio-language-change', {detail: {language: lang}}));
    if (announce) document.getElementById('language-status').textContent = english ? 'English selected.' : '已切换为中文。';
  }
  window.portfolioI18n = {
    t: (zh, en) => document.documentElement.lang === 'en' ? (en || translated(zh)) : zh,
    searchText(root) {
      const words = [];
      walkText(root, node => {
        if (node.parentElement.closest('.project-pager')) return;
        const zh = originalText.get(node) ?? node.nodeValue;
        words.push(zh, translated(zh));
      });
      return words.join(' ');
    }
  };
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language, true, true)));
  window.addEventListener('popstate', () => setLanguage(selectedLanguage()));
  setLanguage(selectedLanguage());
})();
