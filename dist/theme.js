(() => {
  const storageKey = 'goegsa-theme';
  const root = document.documentElement;
  try {
    if (localStorage.getItem(storageKey) === 'light') root.dataset.theme = 'light';
  } catch {}

  const refreshButtons = () => {
    const dark = root.dataset.theme === 'dark';
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.setAttribute('aria-pressed', String(dark));
      const arabic = root.lang === 'ar';
      const label = dark ? (arabic ? 'الوضع الفاتح' : 'Light mode') : (arabic ? 'الوضع الداكن' : 'Dark mode');
      button.innerHTML = '<span aria-hidden="true">' + (dark ? '☀' : '☾') + '</span> ' + label;
      button.setAttribute('aria-label', label);
    }
  };
  document.addEventListener('DOMContentLoaded', refreshButtons);
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-theme-toggle]')) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    refreshButtons();
    try { localStorage.setItem(storageKey, next); } catch {}
  });
})();
