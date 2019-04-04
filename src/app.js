import WatchJS from 'melanke-watchjs';
import addListeners from './listeners';
import renderRss from './renderRss';
import { cleaning, eventLoader } from './utils';
// import makeModalWindow from './modal';

export default () => {
  const { watch } = WatchJS;
  const input = document.querySelector('#main-input');
  const button = document.querySelector('#main-button');
  const errorTag = document.querySelector('#danger');
  const successTag = document.querySelector('#success');

  const state = {
    process: 'init',
    feedLinks: [],
    feeds: [],
    value: '',
    currentFeed: {},
    cleaning: 0,
  };

  addListeners(input, state, button);

  const stateEvents = {
    init: () => {
      input.value = '';
      cleaning(button, successTag, input);
    },
    invalid: () => {
      button.setAttribute('disabled', 'disabled');
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      successTag.innerHTML = '';
    },
    valid: () => {
      cleaning(button, successTag, input);
      input.classList.add('is-valid');
    },
    loading: () => {
      cleaning(button, successTag, input, 1);
      button.setAttribute('disabled', 'disabled');
      input.setAttribute('readonly', 'readonly');
      eventLoader('success', 'Loading...');
    },
    duplicate: () => {
      input.value = '';
      cleaning(button, successTag, input);
    },
    error: () => {
      cleaning(button, successTag, input);
      eventLoader('danger', 'Error! Address is not RSS or link is not correct!');
      setTimeout(() => {
        errorTag.innerHTML = '';
      }, 3000);
    },

  };

  const makeClean = () => {
    document.querySelector('#rss').innerHTML = '';
  };

  const addRss = () => {
    const result = [];
    const feed = state.currentFeed;
    feed.items.forEach((item, index) => {
      const rssTag = renderRss(item, index);
      result.push(rssTag);
    });
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="row no-gutters">
        <div  class="col-12">
          <h2>${feed.title}</h2>
        </div>
        <div class="col-12 w-100">
          ${result.join('')}
        </div>
      </div>`;
    document.querySelector('#rss').appendChild(div);
  };

  watch(state, 'process', () => stateEvents[state.process]());
  watch(state, 'currentFeed', addRss);
  watch(state, 'cleaning', makeClean);
};
