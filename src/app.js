/* eslint-disable no-use-before-define */
import WatchJS from 'melanke-watchjs';
import addListeners from './listeners';
import renderFeed from './renderFeed';

export default () => {
  const { watch } = WatchJS;
  const input = document.querySelector('#main-input');
  const button = document.querySelector('button[type="submit"]');
  const errorTag = document.querySelector('#danger');
  const successTag = document.querySelector('#success');

  const state = {
    process: 'init',
    feedLinks: [],
    feeds: [],
    value: '',
    currentFeed: {},
    newFeed: {},
  };

  addListeners(input, state, button);

  const formState = {
    init: () => {
      button.removeAttribute('disabled');
      input.classList.add('none');
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('readonly', 'readonly');
      successTag.innerHTML = '';
      input.value = '';
    },
    invalid: () => {
      button.setAttribute('disabled', 'disabled');
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      successTag.innerHTML = '';
    },
    valid: () => {
      button.removeAttribute('disabled');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      successTag.innerHTML = '';
    },
    loading: () => {
      button.setAttribute('disabled', 'disabled');
      input.classList.remove('is-valid', 'is-invalid');
      input.classList.add('none');
      input.setAttribute('readonly', 'readonly');
      renderEvents('success', 'Loading...');
    },
    error: () => {
      button.removeAttribute('disabled');
      input.classList.add('none');
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('readonly', 'readonly');
      successTag.innerHTML = '';
      renderEvents('danger', 'Error! Address is not RSS or link is not correct!');
      setTimeout(() => {
        errorTag.innerHTML = '';
      }, 3000);
    },

  };

  const renderRss = () => {
    const result = [];
    const feed = state.currentFeed;
    const lengthOfNews = 10;
    feed.items.length = lengthOfNews;
    feed.items.forEach((item, index) => {
      const rssTag = renderFeed(item, index);
      result.push(rssTag);
    });
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="row no-gutters">
        <div  class="col-12">
          <h2>${feed.title}</h2>
        </div>
        <div class="tag-to-add col-12 w-100">
          ${result.join('')}
        </div>
      </div>`;
    const rssDiv = document.querySelector('#rss');
    rssDiv.insertBefore(div, rssDiv.firstChild);
  };

  const addNewFeed = () => {
    const channelTitle = state.newFeed.channel;
    const item = state.newFeed.content;
    const h2 = [...document.querySelectorAll('h2')].filter(el => el.textContent === channelTitle);
    const tagToAddFeed = h2[0].parentNode.nextElementSibling;
    const content = renderFeed(item, 252);
    const div = document.createElement('div');
    div.innerHTML = content;
    tagToAddFeed.insertBefore(div, tagToAddFeed.firstChild);
  };

  const cleaning = (y = 0) => {
    // eslint-disable-next-line no-param-reassign
    if (y === 0) successTag.innerHTML = '';
    button.removeAttribute('disabled');
    input.classList.add('none');
    input.classList.remove('is-valid', 'is-invalid');
    input.removeAttribute('readonly', 'readonly');
  };
  const makeCleanRssTag = () => {
    document.querySelector('#rss').innerHTML = '';
  };
  const renderEvents = (event, message) => {
    const parent = document.querySelector(`#${event}`);
    const tag = `
      <div class="alert alert-${event} alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
          ${message}
  </div> `;
    const div = document.createElement('div');
    div.innerHTML = tag;
    parent.appendChild(div);
  };

  watch(state, 'process', () => formState[state.process]());
  watch(state, 'currentFeed', renderRss);
  watch(state, 'cleaning', makeCleanRssTag);
  watch(state, 'newFeed', addNewFeed);
};
