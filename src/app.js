import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';
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
        state.currentFeed = { title, items };
        // eslint-disable-next-line no-param-reassign
        stateObj.feeds = [state.currentFeed, ...stateObj.feeds];
      })
      .catch(() => {
        state.process = 'error';
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

    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    const filtered = state.feedLinks.filter(item => item === url);
    if (filtered.length === 0) getFeed(url, state);
    else {
      state.process = 'duplicate';
    }
    const aList = document.querySelectorAll('.modalWindow');
    console.log(aList);
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

  const cleaning = (y = 0) => {
    if (y === 0) successTag.innerHTML = '';
    button.removeAttribute('disabled');
    input.classList.add('none');
    input.classList.remove('is-valid', 'is-invalid');
    input.removeAttribute('readonly', 'readonly');
  };

  const processState = () => {
    switch (state.process) {
      case 'init':
        input.value = '';
        cleaning();
        break;

      case 'invalid':
        button.setAttribute('disabled', 'disabled');
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        successTag.innerHTML = '';
        break;

      case 'valid':
        cleaning();
        input.classList.add('is-valid');
        break;

      case 'loading':
        cleaning(1);
        button.setAttribute('disabled', 'disabled');
        input.setAttribute('readonly', 'readonly');
        eventLoader('success', 'Loading...');
        break;

      case 'duplicate':
        input.value = '';
        cleaning();
        break;

      case 'error':
        cleaning();
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
    const result = [];
    const feed = state.currentFeed;
    feed.items.forEach((item, index) => {
      console.log(item);
      const href = item.querySelector('link').textContent;
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const feedStr = `
      <li class="col-12">
        <a href="${href}">
          ${title}
        </a>
        <a href="#" class="nav-link modalWindow" data-toggle="modal" data-target="#modal${index}">Open</a>
      </li>
      <div class="modal fade" id="modal${index}" tabindex="-1" role="dialog" aria-labelledby="modalWindow"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="modalWindowLabel${index}">${title}</h5>
                  <button class="close" type="button" data-dismiss="modal" aria-label="close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
              ${description}
              </div>

          </div>
      </div>
  </div>`;
      result.push(feedStr);
    });
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="row no-gutters">
        <div  class="col-12">
          <h2>${feed.title}</h2>
        </div>
        <div class="col-12">
          ${result.join('')}
        </div>
      </div>`;
    document.querySelector('#rss').appendChild(div);
  };

  watch(state, 'process', processState);
  watch(state, 'currentFeed', feedState);
};
