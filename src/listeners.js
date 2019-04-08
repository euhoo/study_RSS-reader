import isURL from 'validator/lib/isURL';
import feedQuery from './queries';

export default (input, state, button) => {
  input.addEventListener('input', ({ target }) => {
    // eslint-disable-next-line no-param-reassign
    state.value = target.value;
    // eslint-disable-next-line no-param-reassign
    if (state.value.length === 0) state.processState = 'init';
    // eslint-disable-next-line no-param-reassign
    else if (isURL(state.value)) state.processState = 'valid';
    // eslint-disable-next-line no-param-reassign
    else if (!isURL(state.value)) state.processState = 'invalid';
  });

  button.addEventListener('click', () => {
    // eslint-disable-next-line no-param-reassign
    state.processState = 'loading';
    const link = state.value;
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.find(item => item === url);
    if (!filtered) feedQuery(url, state);
    else {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'init';
    }
  });
};
