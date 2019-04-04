/* eslint-disable no-param-reassign */
import axios from 'axios';
import isURL from 'validator/lib/isURL';

const getFeed = (url, state) => {
  const parser = new DOMParser();
  axios.get(url)
    .then(({ data }) => {
      state.process = 'init';
      const doc = parser.parseFromString(data, 'application/xml');
      const title = doc.querySelector('title').textContent;
      const items = [...doc.querySelectorAll('item')];

      state.feedLinks = [...state.feedLinks, url];
      state.currentFeed = { title, items };

      state.feeds = [state.currentFeed, ...state.feeds];
    })
    .catch(() => {
      state.process = 'error';
    })
    .finally(() => {
      setTimeout(() => {
        console.log('sds');
        /*
        state.cleaning += 1;
        state.feeds.length = 0;
        const links = [];
        state.feedLinks.forEach((link) => {
          links.push(link);
        });
        state.feedLinks.length = 0;
        links.forEach((link) => {
          getFeed(link, state);

        });
        */
      }, 5000);
    });
};

export default (input, state, button) => {
  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    if (state.value.length === 0) state.process = 'init';
    else state.process = isURL(state.value) ? 'valid' : 'invalid';
  });

  button.addEventListener('click', () => {
    state.process = 'loading';
    const link = state.value;

    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.filter(item => item === url);
    if (filtered.length === 0) getFeed(url, state);
    else {
      state.process = 'duplicate';
    }
  });
};
