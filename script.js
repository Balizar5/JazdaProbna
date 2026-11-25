const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

themeToggle.hidden = false;

themeToggle.addEventListener('click', () => {
  const darkMode = root.dataset.theme !== 'dark';
  root.dataset.theme = darkMode ? 'dark' : 'light';
  themeToggle.setAttribute('aria-pressed', String(darkMode));
});
