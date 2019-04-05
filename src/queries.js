/* eslint-disable no-param-reassign */
import axios from 'axios';

const parse = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

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
        }, 5000);
      });
  });
};

// eslint-disable-next-line import/prefer-default-export
export const getFeed = (url, state) => {
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
    })
    .finally(() => {
      setTimeout(() => {
        nakeUpdate(state);
      }, 5000);
    });
};
