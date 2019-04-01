import { promises } from 'fs';
import isURL from 'validator/lib/isURL';

const clean = tag => [...tag.children].forEach(item => tag.removeChild(item));
const addTag = (tag, item, parent) => {
  const el = document.createElement(tag);
  el.textContent = item;
  parent.append(el);
};

export default (input) => {
  const state = { rss: '' };
  input.addEventListener('input', ({ target }) => {
    const parser = new DOMParser();
    const url = new URL(target.value);
    promises.fetch(url)
      .then((string) => {
        state.rss = parser.parseFromString(string, target.value);
      });
  });
  return state;
};
