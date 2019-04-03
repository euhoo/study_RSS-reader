/* eslint-disable no-param-reassign */
import axios from 'axios';

const parser = new DOMParser();

export default (url, stateObj) => {
  axios.get(url)
    .then(({ data }) => {
      const doc = parser.parseFromString(data, 'application/xml');
      const title = doc.querySelector('title').textContent;
      const items = [...doc.querySelectorAll('item')];
      stateObj.currentRss = {
        title,
        items,
        value: stateObj.value,
      };
      stateObj.allRss = [stateObj.currentRss, ...stateObj.allRss];
    })
    .catch((data) => {
      stateObj.error = data;
    });
};
