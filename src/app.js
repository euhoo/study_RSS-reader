import WatchJS from 'melanke-watchjs';
import addListeners from './listeners';
import renderFeed from './renderFeed';
import { updateQuery } from './queries';

export default () => {
  const { watch } = WatchJS;
  const input = document.querySelector('#main-input');
  const button = document.querySelector('button[type="submit"]');
  const eventTag = document.querySelector('#event');

  const state = {
    processState: 'init',
    value: '',
    feedLinks: [],
    feeds: [],
    channelTitles: [],
  };

  updateQuery(state);
  addListeners(input, state, button);


  const renderEvents = (event, message) => {
    eventTag.innerHTML = `
    <div class="alert alert-${event} alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span></button>
        ${message}
    </div> `;
  };

  const formStateActions = {
    init: () => {
      button.removeAttribute('disabled');
      input.classList.add('none');
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('readonly', 'readonly');
      eventTag.innerHTML = '';
      input.value = '';
    },
    invalid: () => {
      button.setAttribute('disabled', 'disabled');
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      eventTag.innerHTML = '';
    },
    valid: () => {
      button.removeAttribute('disabled');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      eventTag.innerHTML = '';
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
      eventTag.innerHTML = '';
      renderEvents('danger', 'Error! Address is not RSS or link is not correct!');
      setTimeout(() => {
        eventTag.innerHTML = '';
      }, 3000);
    },
  };


  const renderRssFeeds = () => {
    const rssDiv = document.querySelector('#rss');
    rssDiv.innerHTML = `
      <div class="row no-gutters">
        <div id="rss-title" class="col-12">
        </div>
        <div id="tag-to-add" class="col-12 w-100">
        </div>
      </div>`;
    const feedsTag = document.querySelector('#tag-to-add');
    const titlesTag = document.querySelector('#rss-title');
    feedsTag.innerHTML = state.feeds.reduce((acc, feed) => [...acc, renderFeed(feed)], []).join('');
    titlesTag.innerHTML = state.channelTitles.reduce((acc, title) => [...acc, `<p><strong>${title}</strong></p>`], []).join('');
  };

  watch(state, 'processState', () => formStateActions[state.processState]());
  watch(state, 'feeds', renderRssFeeds);
};
