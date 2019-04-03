/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import makeRequest from './request';

const cleanClassList = (cl) => {
  cl.remove('is-valid');
  cl.remove('is-invalid');
};

const setFrameColor = (st) => {
  let color = 'is-valid';
  if (st.value.length === 0) color = '';
  else if (isURL(st.value) === false) color = 'is-invalid';
  return color;
};

const { watch } = WatchJS;

export default () => {
  const state = {
    value: '',
    inputFrame: 'none',
    error: '',
    currentRss: {},
    allRss: [],
  };

  const input = document.querySelector('#main-input');
  const button = document.querySelector('#main-button');
  const errorTag = document.querySelector('#error');

  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    (state.value.length > 0 && isURL(state.value)) ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'disabled');
    state.inputFrame = setFrameColor(state);
  });

  button.addEventListener('click', () => {
    const link = state.value;
    input.value = '';
    state.inputFrame = 'none';
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    makeRequest(url, state);
  });

  const inputFrameState = () => {
    cleanClassList(input.classList);
    if (state.inputFrame.length > 0) input.classList.add(state.inputFrame);
  };

  const renderError = () => {
    if (state.error.length === 0) return;
    const error = `
    <div class="alert alert-danger alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span></button>
        Error! Address is not RSS or link is not correct!
</div> `;
    const div = document.createElement('div');
    div.innerHTML = error;
    errorTag.appendChild(div);
    state.error = '';
    setTimeout(() => {
      errorTag.innerHTML = '';
    }, 3000);
  };

  const renderRss = () => {
    const filtered = state.allRss.filter(item => item === state.value);
    if (filtered.length > 0) {
      return;
    }

    state.allRss = [state.value, ...state.allRss];
    const rssObj = state.currentRss;
    const res = [];
    rssObj.items.forEach((item) => {
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
          <h2 id="title">${rssObj.title}</h2>
        </div>
        <div class="col-12">
          ${res.join('')}
        </div>
      </div>`;
    document.querySelector('#rss').appendChild(div);
  };

  watch(state, 'inputFrame', () => inputFrameState());
  watch(state, 'error', renderError);
  watch(state, 'currentRss', renderRss);
};
