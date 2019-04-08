import WatchJS from 'melanke-watchjs';
import addListeners from './listeners';
import renderFeed from './renderFeed';

const addTags = (tags) => {
  const jumboTag = document.querySelector('#jumbo');
  tags.forEach((tag) => {
    const tagName = document.createElement('div');
    tagName.id = tag;
    tagName.classList.add('container');
    jumboTag.appendChild(tagName);
  });
};

export default () => {
  const { watch } = WatchJS;
  const input = document.querySelector('#main-input');
  const button = document.querySelector('button[type="submit"]');

  const state = {
    processState: 'init',
    value: '',
    feedLinks: [],
    feeds: [],
    channelTitles: [],
  };

  addListeners(input, state, button);
  addTags(['loading', 'success', 'danger']);

  const errorTag = document.querySelector('#danger');
  const successTag = document.querySelector('#success');
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

  const formStateActions = {
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
  const renderRssFeeds = () => {
    const rssDiv = document.querySelector('#rss');
    rssDiv.innerHTML = `
      <div class="row no-gutters">
        <div id="rss-title" class="col-12">
        </div>
        <div id="tag-to-add" class="col-12 w-100">
        </div>
      </div>`;

    const titles = state.channelTitles;
    const titlesToAdd = titles.reduce((acc, el) => [...acc, `<p><strong>${el}</strong></p>`], []).join('');
    const divToAdd = document.querySelector('#tag-to-add');
    const { feeds } = state;
    const result = feeds.reduce((acc, el, ind) => [...acc, renderFeed(el, ind)], []).join('');
    divToAdd.innerHTML = result;
    const titleTag = document.querySelector('#rss-title');
    titleTag.innerHTML = titlesToAdd;
  };
  watch(state, 'processState', () => formStateActions[state.processState]());
  watch(state, 'feeds', renderRssFeeds);
};
