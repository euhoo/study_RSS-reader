
/* eslint-disable no-param-reassign */
// подключить здесь lodash
import axios from 'axios';
import isURL from 'validator/lib/isURL';
import _ from 'lodash';

const parser = new DOMParser();

const nakeUpdate = (state) => {
  const links = state.feedLinks;
  links.forEach((link) => {
    axios.get(link)
      .then(({ data }) => {
        // state.newFeeds.length = 0; // обнулили массив с новыми новостями
        const doc = parser.parseFromString(data, 'application/xml');
        const existTitle = doc.querySelector('title').textContent; // title rss канала
        const obj = {
          existFeed: '',
          index: 0,
        };
        state.feeds.forEach((el, index) => {
          if (el.title === existTitle) {
            // console.log(el.items[0]);
            obj.existFeed = el.items[0];
            obj.index = index;
          }
        });
        const newFeed = doc.querySelector('item');
        if (newFeed.querySelector('link').textContent !== obj.existFeed.querySelector('link').textContent) {
          state.feeds[obj.index].items.unshift(newFeed);
          state.newFeeds = {
            channel: existTitle,
            content: newFeed,
          }; // добавляем наш объект в result;
        }
      })
      .catch(() => {
        // state.process = 'error';// пересмотреть куда будет выводиться ошибка. сюда ее выводить ошибочно
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
