/* eslint-disable no-param-reassign */
import axios from 'axios';

const parse = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

const updateQuery = (state, url, title) => {
  axios.get(url)
    .then(({ data }) => {
      let existFeed;
      state.feeds.forEach((el) => {
        if (el.title === title) {
          existFeed = el.items;
        }
      });
      const doc = parse(data);
      const newFeed = doc.querySelector('item');
      if (newFeed.querySelector('link').textContent !== existFeed[0].querySelector('link').textContent) {
        existFeed[0].querySelector('link').textContent = newFeed.querySelector('link').textContent;
        state.newFeed = {
          channel: title,
          content: newFeed,
        };
      }
    })
    .catch(() => {
      console.log('error');
    });
};

export default (url, state) => {
  let link;
  let existTitle;

  axios.get(url)
    .then(({ data }) => {
      state.process = 'init';
      const doc = parse(data);
      const title = doc.querySelector('title').textContent;
      const items = [...doc.querySelectorAll('item')];
      state.feedLinks = [...state.feedLinks, url];
      state.currentFeed = { title, items };
      state.feeds = [state.currentFeed, ...state.feeds];
      link = url;
      existTitle = title;
    })
    .catch(() => {
      state.process = 'error';
    })
    .finally(() => {
      if (link) {
        setInterval(() => {
          updateQuery(state, link, existTitle);
        }, 5000);
      }
    });
};
