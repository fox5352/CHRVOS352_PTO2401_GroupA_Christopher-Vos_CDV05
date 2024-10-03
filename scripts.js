
const getSelectors = () => {
    return {
        //header
        navToggle: document.querySelector("#nav-toggle-btn"),
        // navMenu
        navMenu: document.querySelector("#nav-menu"),
        navMenuCloseBtn: document.querySelector("#nav-menu-close-btn"),
        // theme button parts
        themeBtn: document.querySelector("#theme-btn"),
        themeBtnCover: document.querySelector(".navbar-menu__theme-button-cover"),
        themeBtnIcon: document.querySelector(".navbar-menu__theme-button-icon"),
    }
}

/**
 * A setTheme function
 * @param {'light'| 'dark'} theme
 */
function setTheme(theme) {
    document.documentElement.style.setProperty('--bg-color', theme === 'dark'? '#222831': '#f5f5f5');
    document.documentElement.style.setProperty('--ac-one', theme === 'dark'? '#ff6000': '#48cfcb');
    document.documentElement.style.setProperty('--ac-two', theme === 'dark'? '#eb5b00': '#229799');
    document.documentElement.style.setProperty('--fg-color', theme === 'dark'? '#eeeeee': '#424242');
    localStorage.setItem('theme', theme);
}

/**
 * set the theme button
 */
function setThemeOfBtn(theme) {
    const localTags = getSelectors();    
    
    if (theme === 'dark') {
        localTags.themeBtnCover.classList.remove('navbar-menu__theme-button-cover--light');
        localTags.themeBtnIcon.classList.remove('navbar-menu__theme-button-icon--light');
    }else {
        localTags.themeBtnCover.classList.add('navbar-menu__theme-button-cover--light');
        localTags.themeBtnIcon.classList.add('navbar-menu__theme-button-icon--light');
    }
}

/**
 * Checks for theme in local storage if not then checks users preferred theme and sets the root property accordingly
 */
function checkTheme() {
    let savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
    }

    setTheme(savedTheme);
    setThemeOfBtn(savedTheme);
}

/**
 * @callback EventListenerCallback
 * @param {Event} event - The event object passed to the callback.
 */
/**
 * Sets up a event listener and return a closure to remove said event listener
 * @param {string} eventType the type of event being
 * @param {HTMLElement} tag the tag to bind the event to
 * @param {EventListenerCallback} closure the callback to be executed
 * @returns {Function}
 */
function setUpEventListener(eventType, tag, closure) {    
    tag.addEventListener(eventType, closure);
    return () => {
        tag.removeEventListener(eventType, closure);
    }
}

/**
 * 
 * @param {HTMLDialogElement} tag 
 * @param {boolean} [state]
 */
function toggleModel(tag, state) {
    if (state === undefined) {
        tag.style.display = 'flex';
        tag.open = !tag.open;
    }else {
        tag.style.display = state? 'flex' : 'none';
        tag.open = state;
    }
}

function setUpNavMenuEventListeners() {
    const localTags = getSelectors();
    
    setUpEventListener('click', localTags.navMenuCloseBtn, (event) => {
        toggleModel(localTags.navMenu, false)
    })
    
    setUpEventListener('click', localTags.themeBtn, (event) => {
        const currentTheme = localStorage.getItem('theme')  === 'dark'? 'light' : 'dark';
        setTheme(currentTheme);
        setThemeOfBtn(currentTheme);
    })
}

function main() {
    // set site theme
    checkTheme();

    const tags = getSelectors();
    
    const unSubSelector = setUpEventListener("click", tags.navToggle, (event) => {
        tags.navToggle.classList.toggle("header__navbar-button--active");
        toggleModel(tags.navMenu)
    })
    
    setUpNavMenuEventListeners();
}
main();