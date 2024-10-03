/**
 * 
 */
export function throttle(func, delay) {
  let lock = false;

  return function(...args) {
    if (lock === false) {
      lock = true;
      setTimeout(() => {
        lock = false;
      }, delay);

      func.apply(this, args);
    }else {
      return
    }
  }
}

export function debounce(func, delay) {
  let debounceTimer;
  
  return function(...args) {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
      func.apply(this, args);
    }, delay);

  };
}