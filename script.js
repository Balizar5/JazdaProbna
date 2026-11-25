const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;
const themeKey = 'jazda-probna-theme';

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

try {
  applyTheme(localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light');
} catch {
  applyTheme('light');
}

themeToggle.hidden = false;

themeToggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);

  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    // The current page still keeps the selected theme when storage is unavailable.
  }
});
