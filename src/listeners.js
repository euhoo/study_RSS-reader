/* eslint-disable no-param-reassign */
import isURL from 'validator/lib/isURL';
import { getFeed } from './queries';

export default (input, state, button) => {
  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    if (state.value.length === 0) state.process = 'init';
    else if (isURL(state.value)) state.process = 'valid';
    else if (!isURL(state.value)) state.process = 'invalid';
  });

  button.addEventListener('click', () => {
    state.process = 'loading';
    const link = state.value;

    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.find(item => item === url);
    if (!filtered) getFeed(url, state);
    else {
      state.process = 'init';
    }
  });
};
