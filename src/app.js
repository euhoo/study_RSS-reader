import WatchJS from 'melanke-watchjs';
import addListeners from './listeners';
import { renderAllFeeds, renderEvents } from './renderers';
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
      renderEvents('success', 'Loading...', eventTag);
    },
    error: () => {
      button.removeAttribute('disabled');
      input.classList.add('none');
      input.classList.remove('is-valid', 'is-invalid');
      input.removeAttribute('readonly', 'readonly');
      eventTag.innerHTML = '';
      renderEvents('danger', 'Error! Address is not RSS or link is not correct!', eventTag);
      setTimeout(() => {
        eventTag.innerHTML = '';
      }, 3000);
    },
  };

  updateQuery(state);
  addListeners(input, state, button);

  watch(state, 'processState', () => formStateActions[state.processState]());
  watch(state, 'feeds', () => renderAllFeeds(state));
};
