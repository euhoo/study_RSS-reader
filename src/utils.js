export const setFrameColor = (st) => {
  let color = 'is-valid';
  if (st.value === false) color = '';
  else if (st.correctUrl === false) color = 'is-invalid';
  return color;
};
export const cleanClassList = (cl) => {
  cl.remove('is-valid');
  cl.remove('is-invalid');
};
