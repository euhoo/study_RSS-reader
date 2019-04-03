export const setFrameColor = (st) => {
  let color = 'is-valid';
  if (st.value.length === 0) color = '';
  else if (st.correctUrl === false) color = 'is-invalid';
  return color;
};
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
