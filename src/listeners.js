/* eslint-disable no-param-reassign */
import isURL from 'validator/lib/isURL';
import feedQuery from './queries';

export default (input, state, button) => {
  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    if (state.value.length === 0) state.processState = 'init';
    else if (isURL(state.value)) state.processState = 'valid';
    else if (!isURL(state.value)) state.processState = 'invalid';
  });

  button.addEventListener('click', () => {
    state.processState = 'loading';
    const link = state.value;

    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.find(item => item === url);
    if (!filtered) feedQuery(url, state);
    else {
      state.processState = 'init';
    }
  });
};
