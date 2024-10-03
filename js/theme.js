
// -------------------------------------- theme utils -------------------------------------- 
/**
 * Sets the theme and saves it to local storage
 * @param {'light'| 'dark'} theme
 */
export function setTheme(theme) {
    document.documentElement.style.setProperty('--bg-color', theme === 'dark'? '#222831': '#f5f5f5');
    document.documentElement.style.setProperty('--ac-one', theme === 'dark'? '#ff6000': '#48cfcb');
    document.documentElement.style.setProperty('--ac-two', theme === 'dark'? '#eb5b00': '#FF0080');
    document.documentElement.style.setProperty('--fg-color', theme === 'dark'? '#eeeeee': '#424242');
    localStorage.setItem('theme', theme);
}

/**
 * Sets the theme button appearance
 * @param {'light'| 'dark'} theme
 * @param {Object} tags
 */
function setThemeOfBtn(theme, tags) {    
    if (theme === 'dark') {
        tags.themeBtnCover.classList.remove('navbar-menu__theme-button-cover--light');
        tags.themeBtnIcon.classList.remove('navbar-menu__theme-button-icon--light');
    }else {
        tags.themeBtnCover.classList.add('navbar-menu__theme-button-cover--light');
        tags.themeBtnIcon.classList.add('navbar-menu__theme-button-icon--light');
    }
}

/**
 * Checks for theme in local storage if not then checks users preferred theme and sets the root property accordingly
 */
export function checkTheme(tags) {
    let savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
    }

    setTheme(savedTheme, tags);
    setThemeOfBtn(savedTheme, tags);
}