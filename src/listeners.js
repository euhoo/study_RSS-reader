import isURL from 'validator/lib/isURL';
import feedQuery from './queries';

const cors = 'https://cors-anywhere.herokuapp.com/';

export default (input, state, button) => {
  input.addEventListener('input', ({ target }) => {
    // eslint-disable-next-line no-param-reassign
    state.value = target.value;
    if (state.value.length === 0) {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'init';
      return;
    }
    if (!isURL(state.value)) {
    // eslint-disable-next-line no-param-reassign
      state.processState = 'invalid';
      return;
    }
    // eslint-disable-next-line no-param-reassign
    state.processState = 'valid';
  });

  button.addEventListener('click', () => {
    // eslint-disable-next-line no-param-reassign
    state.processState = 'loading';
    const link = state.value;
    const url = `${cors}${link}`;
    const filteredLinks = state.feedLinks.filter(item => item === url);
    if (filteredLinks.length === 0) feedQuery(url, state);
    else {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'init';
    }
  });
};
