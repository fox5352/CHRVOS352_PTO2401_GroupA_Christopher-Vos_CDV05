import { debounce } from "../utils/utils.js";
import {checkTheme, setTheme } from "./theme.js"

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
function getElements () {
    const elements = {
        navToggle: document.querySelector("#nav-toggle-btn"),
        navMenu: document.querySelector("#nav-menu"),
        navMenuCloseBtn: document.querySelector("#nav-menu-close-btn"),
        themeBtn: document.querySelector("#theme-btn"),
        themeBtnCover: document.querySelector(".navbar-menu__theme-button-cover"),
        themeBtnIcon: document.querySelector(".navbar-menu__theme-button-icon"),
    };

    for (const [key, value] of Object.entries(elements)) {
        if (!value) {
            console.warn(`Element "${key}" not found in the DOM`);
        }
    }

    return elements;
}

/**
 * set up the relevant tags and animationName together
 * @returns {Array<AnimationMap>}
 */
function getElementsArrayForAnimation() {
    return [
        {tag: document.querySelector(".intro__title-span"), animationName: "hop"},
        {tag: document.querySelector(".about__text"), animationName: "text-focus-in"},
        {tag: document.querySelector("#online-cv"), animationName: "jello-horizontal"},
        {tag: document.querySelector("#todobuddy"), animationName: "jello-horizontal"},
        {tag: document.querySelector("#ebooks-example"), animationName: "jello-horizontal"},
    ]
}


// -------------------------------------- animation utils -------------------------------------- 
function isElementInViewport(el) {
  // Get the bounding rectangle of the element
  const rect = el.getBoundingClientRect();
  
  // Check if the element is within the viewport
  return (
    rect.top >= 0 && // Element's top is below the top of the viewport
    rect.left >= 0 && // Element's left is to the right of the left edge of the viewport
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // Element's bottom is above the bottom of the viewport
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) // Element's right is to the left of the right edge of the viewport
  );
}

/**
 * @param {Array<AnimationMap>} tags
 * @returns {UnbindListenerCallback}
 */
function scrollEventTracker(tags) {
    function  mapper() {
        for (const tag of tags) {            
            if (isElementInViewport(tag.tag)) {
                tag.tag.classList.add(tag.animationName);
            } else {
                tag.tag.classList.remove(tag.animationName);
            }
        }
    }
    // initialize the first animations before scrolling
    mapper();

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
        setTheme(currentTheme, localTags);
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
    const tags = getElements();
    
    // set site theme
    checkTheme(tags);
    
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