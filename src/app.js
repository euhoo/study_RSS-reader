import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';

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
    currendFeed: {},
  };


  const getFeed = (url, stateObj) => {
    const parser = new DOMParser();
    axios.get(url)
      .then(({ data }) => {
        state.process = 'init';
        const doc = parser.parseFromString(data, 'application/xml');
        const title = doc.querySelector('title').textContent;
        const items = [...doc.querySelectorAll('item')];
        // eslint-disable-next-line no-param-reassign
        stateObj.feedLinks = [...stateObj.feedLinks, url];
        state.currendFeed = { title, items };
        // eslint-disable-next-line no-param-reassign
        stateObj.feeds = [state.currendFeed, ...stateObj.feeds];
      })
      .catch(() => {
        state.process = 'error';
        setTimeout(() => {
          state.process = 'init';
        }, 3000);
      });
  };

  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    if (state.value.length === 0) state.process = 'init';
    else state.process = isURL(state.value) ? 'valid' : 'invalid';
  });

  button.addEventListener('click', () => {
    state.process = 'loading';
    const link = state.value;
    input.value = '';
    state.inputFrame = 'none';
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.filter(item => item === url);
    if (filtered.length === 0) getFeed(url, state);
    else {
      state.process = 'duplicate';
    }
  });


  /*      view    */

  const eventLoader = (event, message) => {
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

  const processState = () => {
    switch (state.process) {
      case 'init':
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        successTag.innerHTML = '';
        break;

      case 'invalid':
        button.setAttribute('disabled', 'disabled');
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        successTag.innerHTML = '';
        break;

      case 'valid':
        button.removeAttribute('disabled');
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        successTag.innerHTML = '';
        break;

      case 'loading':
        button.setAttribute('disabled', 'disabled');
        input.classList.remove('is-valid', 'is-invalid');
        input.classList.add('none');
        input.setAttribute('readonly', 'readonly');
        eventLoader('success', 'Loading...');
        break;

      case 'duplicate':
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        successTag.innerHTML = '';
        break;

      case 'error':
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        successTag.innerHTML = '';
        eventLoader('danger', 'Error! Address is not RSS or link is not correct!');
        setTimeout(() => {
          errorTag.innerHTML = '';
        }, 3000);

        break;
      default:
        break;
    }
  };


  const feedState = () => {
    const res = [];
    const feed = state.currendFeed;
    feed.items.forEach((item) => {
      const feedStr = `
      <li class="col-12">
        <a href="${item.querySelector('link').textContent}">
          ${item.querySelector('title').textContent}
        </a>
      </li>`;
      res.push(feedStr);
    });
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="row no-gutters">
        <div  class="col-12">
          <h2>${feed.title}</h2>
        </div>
        <div class="col-12">
          ${res.join('')}
        </div>
      </div>`;
    document.querySelector('#rss').appendChild(div);
  };

  watch(state, 'process', processState);
  watch(state, 'currendFeed', feedState);
};
