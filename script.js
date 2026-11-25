const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny';
}

applyTheme('light');
themeToggle.hidden = false;

themeToggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
});
