import config from '../terminal-config.js';
export const themes = ['graphite','paper'];
export function createThemeController({root=document.documentElement, storage, media=window.matchMedia('(prefers-color-scheme: light)'), select=document.querySelector('#theme-select')}={}) {
  let chosen = config.theme.defaultTheme;
  try { storage ??= window.localStorage; chosen = storage.getItem('rishitha-theme') || chosen; } catch { /* System fallback when storage is blocked. */ }
  if (![...themes,'system'].includes(chosen)) chosen='system';
  function apply() {
    root.dataset.theme=chosen==='system'?(media.matches?'paper':'graphite'):chosen;
    root.dataset.selectedTheme=chosen;
    if(select) select.value=chosen;
  }
  function set(value) {
    if (![...themes,'system'].includes(value)) return false;
    chosen=value;
    try { storage?.setItem('rishitha-theme',value); } catch { /* Selection still works for this page. */ }
    apply(); return true;
  }
  select?.addEventListener('change',()=>set(select.value));
  media.addEventListener('change',apply);
  apply();
  return {set,get:()=>chosen};
}
export const themeController = typeof document !== 'undefined' ? createThemeController() : null;
