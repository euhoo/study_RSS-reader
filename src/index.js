// import isURL from 'validator/lib/isURL';
import axios from 'axios';

// import rss from './rss';
// import { promises } from 'fs';
const input = document.querySelector('input');
const rss = (inp) => {
  // const state = { rss: '' };
  inp.addEventListener('input', ({ target }) => {
    const parser = new DOMParser();
    axios.get(target.value)
      .then(string => parser.parseFromString(string, target.value));
    // console.log(isURL(target.value));
    /* promises.fetch(url)
        .then((string) => {
          state.rss = parser.parseFromString(string, target.value);

        });
        */
  });
  // return state;
};

rss(input);
