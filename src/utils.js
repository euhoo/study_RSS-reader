export const cleanClassList = (cl) => {
  cl.remove('is-valid');
  cl.remove('is-invalid');
};

export const makeTemporyVisible = (selector, time) => {
  const element = document.querySelector(selector);
  element.setAttribute('style', 'display:block;');
  window.setTimeout(() => {
    element.setAttribute('style', 'display:none;');
  }, time);
};
