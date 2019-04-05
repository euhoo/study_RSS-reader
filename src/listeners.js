
/* eslint-disable no-param-reassign */
import axios from 'axios';
import isURL from 'validator/lib/isURL';

const parse = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

/*
const nakeUpdate = (state) => {
  const links = state.feedLinks;
  links.forEach((link) => {
    axios.get(link)
      .then(({ data }) => {
        const doc = parse(data);
        const existTitle = doc.querySelector('title').textContent;
        let existFeed;
        state.feeds.forEach((el) => {
          if (el.title === existTitle) {
            existFeed = el.items;
          }
        });
        const newFeed = doc.querySelector('item');
        if (newFeed.querySelector('link').textContent !== existFeed[0].
        // querySelector('link').textContent) {
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
        }, 5000);
      });
  });
};
*/

const getFeed = (url, state) => {
  axios.get(url)
    .then(({ data }) => {
      state.process = 'init';
      const doc = parse(data);
      const title = doc.querySelector('title').textContent;
      const items = [...doc.querySelectorAll('item')];

      state.feedLinks = [...state.feedLinks, url];
      state.currentFeed = { title, items };

      state.feeds = [state.currentFeed, ...state.feeds];
    })
    .catch(() => {
      state.process = 'error';
    });
  /* .finally(() => {
      setTimeout(() => {
        nakeUpdate(state);
      }, 5000);
    }) */
};

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
