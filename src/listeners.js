
/* eslint-disable no-param-reassign */
import axios from 'axios';
import isURL from 'validator/lib/isURL';

const parser = new DOMParser();

const nakeUpdate = (state) => {
  const links = state.feedLinks;
  links.forEach((link) => {
    axios.get(link)
      .then(({ data }) => {
        const doc = parser.parseFromString(data, 'application/xml');
        const existTitle = doc.querySelector('title').textContent;
        let existFeed;
        state.feeds.forEach((el) => {
          if (el.title === existTitle) {
            existFeed = el.items;
            console.log(existFeed);
          }
        });
        const newFeed = doc.querySelector('item');
        if (newFeed.querySelector('link').textContent !== existFeed[0].querySelector('link').textContent) {
          state.newFeed = {
            channel: existTitle,
            content: newFeed,
          };
        }
      })
      .catch(() => {
      })
      .finally(() => {
        setTimeout(() => {
          nakeUpdate(state);
        }, 2000);
      });
  });
};


const getFeed = (url, state) => {
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
        nakeUpdate(state);
      }, 2000);
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
