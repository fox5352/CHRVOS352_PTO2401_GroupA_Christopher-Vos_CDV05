/**
 * 
 */
export default function debounce(func, delay) {
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