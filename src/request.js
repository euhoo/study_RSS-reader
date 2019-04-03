/* eslint-disable no-param-reassign */
import axios from 'axios';

const parser = new DOMParser();
const loadingTag = document.querySelector('#loading');

const whenLoading = () => {
  const tag = `
  <div class="row no-gutters">
   <div class="col-12 col-xs-12 col-sm-12 col-md-9 col-lg-10">
     <div> <p style="color:green;">Please, wait! I'm in process!</p></div>
   </div>
 </div>`;
  const div = document.createElement('div');
  div.innerHTML = tag;
  loadingTag.appendChild(div);
};

export default (url, stateObj) => {
  whenLoading();
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
    })
    .finally(() => {
      loadingTag.innerHTML = '';
    });
};
