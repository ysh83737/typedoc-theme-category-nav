type ThemeChoice = 'os' | 'light' | 'dark';
const THEME_ORDER: ThemeChoice[] = ['os', 'light', 'dark'];

/**
 * Set new Theme.
 * @param theme
 */
function setTheme(theme: ThemeChoice) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('tsd-theme', theme);

  const settingPicker = document.querySelector<HTMLOptionElement>('#tsd-theme');
  if (settingPicker) {
    settingPicker.value = theme;
  }
}

/** User toggle themen */
function onToggleTheme() {
  const curTheme: ThemeChoice = document.documentElement.dataset.theme as never || 'os';
  const index = THEME_ORDER.indexOf(curTheme);
  const nextIndex = (index + 1) % THEME_ORDER.length;
  const nextTheme = THEME_ORDER[nextIndex];
  setTheme(nextTheme);
}

(() => {
  const themePicker = document.querySelector<HTMLDivElement>('#tsd-navigation-theme');
  if (!themePicker) return;

  themePicker.addEventListener('click', onToggleTheme);
})();
