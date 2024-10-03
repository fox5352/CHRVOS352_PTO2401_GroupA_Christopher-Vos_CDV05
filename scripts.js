import { debounce, throttle } from "./utils/utils.js";


// -------------------------------------- types -------------------------------------- 
/**
 * @callback EventListenerCallback
 * @param {Event} event - The event object passed to the callback.
 */

/**
 * @callback UnbindListenerCallback callback function to remove the listener from DOM
 */

/**
 * @typedef {Object} AnimationMap
 * @property {HTMLElement} tag
 * @property {string} animationName
 */

// -------------------------------------- configuration -------------------------------------- 
const getElements = () => {
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
 * set up the relevant tags and animationName together
 * @returns {Array<AnimationMap>}
 */
const getElementsArrayForAnimation = () => {
    return [
        {tag: document.querySelector(".intro__title-span"), animationName: "hop"},
        {tag: document.querySelector(".about__title"), animationName: "tracking-in-contract"},
        {tag: document.querySelector(".about__text"), animationName: "text-focus-in"},
    ]
}

// -------------------------------------- theme utils -------------------------------------- 
/**
 * A setTheme function
 * @param {'light'| 'dark'} theme
 */
function setTheme(theme) {
    document.documentElement.style.setProperty('--bg-color', theme === 'dark'? '#222831': '#f5f5f5');
    document.documentElement.style.setProperty('--ac-one', theme === 'dark'? '#ff6000': '#48cfcb');
    document.documentElement.style.setProperty('--ac-two', theme === 'dark'? '#eb5b00': '#ff69b4');
    document.documentElement.style.setProperty('--fg-color', theme === 'dark'? '#eeeeee': '#424242');
    localStorage.setItem('theme', theme);
}

/**
 * set the theme button
 */
function setThemeOfBtn(theme) {
    const localTags = getElements();    
    
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

// -------------------------------------- animation utils -------------------------------------- 
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * @param {Array<AnimationMap>} tags
 * @returns {UnbindListenerCallback}
 */
function scrollEventTracker(tags) {
    const mapper = () => {
        tags.forEach((tag) => {
            if (isElementInViewport(tag.tag)) {
                tag.tag.classList.add(tag.animationName);
            } else {
                tag.tag.classList.remove(tag.animationName);
            }
        });
    }

    const debounceMapper = debounce(mapper, 100)

    window.addEventListener('scroll', debounceMapper)

    return () => {
        window.removeEventListener('scroll', debounceMapper)
    }
}


// -------------------------------------- eventListeners utils -------------------------------------- 
/**
 * Sets up a event listener and return a closure to remove said event listener
 * @param {string} eventType the type of event being
 * @param {HTMLElement} tag the tag to bind the event to
 * @param {EventListenerCallback} closure the callback to be executed
 * @returns {UnbindListenerCallback}
 */
function setUpEventListener(eventType, tag, closure) {    
    tag.addEventListener(eventType, closure);
    return () => {
        tag.removeEventListener(eventType, closure);
    }
}

function setUpNavMenuEventListeners() {
    const localTags = getElements();
    
    setUpEventListener('click', localTags.navMenuCloseBtn, (event) => {
        toggleModel(localTags.navMenu)
    })
    
    setUpEventListener('click', localTags.themeBtn, (event) => {
        const currentTheme = localStorage.getItem('theme')  === 'dark'? 'light' : 'dark';
        setTheme(currentTheme);
        setThemeOfBtn(currentTheme);
    })
}


/**
 * 
 * @param {HTMLDialogElement} tag 
 */
function toggleModel(tag) {
    tag.classList.toggle('display')
}

function main() {
    // set site theme
    checkTheme();

    const tags = getElements();
    
    // sets up event handler for navbar toggle button
    setUpEventListener("click", tags.navToggle, () => {
        toggleModel(tags.navMenu)
    })
    
    // sets up event handler for nav menu items
    setUpNavMenuEventListeners();

    // sets up event handler for scroll event
    const animations = getElementsArrayForAnimation()
    scrollEventTracker(animations);

}
main();