/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import isURL from 'validator/lib/isURL';

export default () => {
  const { watch } = WatchJS;
  const input = document.querySelector('#main-input');
  const button = document.querySelector('#main-button');
  const errorTag = document.querySelector('#error');

  const state = {
    process: 'init', // invalid, loading, error, duplicate, valid
    feedslist: [],
    currentFeed: {},
    value: '',
  };


  const getFeed = (url, stateObj) => {
    const parser = new DOMParser();
    axios.get(url)
      .then(({ data }) => {
        state.process = 'init';
        const doc = parser.parseFromString(data, 'application/xml');
        const title = doc.querySelector('title').textContent;
        const items = [...doc.querySelectorAll('item')];
        /* добавляю ссылку именно здесь,т.к. здесь мы появляемся,только если ссылка - rss */
        stateObj.feedslist = [...stateObj.feedslist, url];
        stateObj.currentFeed = {
          title,
          items,
        };
      })
      .catch(() => {
        state.process = 'error';// написать функцию,которая возвращает ошибку
        setTimeout(() => {
          state.process = 'init';// написать функцию,которая возвращает ошибку
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
    const filtered = state.feedslist.filter(item => item === url);
    if (filtered.length === 0) getFeed(url, state);
    else {
        state.process = 'duplicate';// написать функцию,которая возвращает ошибку
    }
  });


  /*      view    */

  const whenError = () => {
    const error = `
    <div class="alert alert-danger alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span></button>
        Error! Address is not RSS or link is not correct!
</div> `;
    const div = document.createElement('div');
    div.innerHTML = error;
    errorTag.appendChild(div);
    setTimeout(() => {
      errorTag.innerHTML = '';
    }, 3000);
  };

  const processState = () => {
    switch (state.process) {
      case 'init':
        // button.setAttribute('disabled', 'disabled');
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        // форму очистить
        break;

      case 'invalid':
        button.setAttribute('disabled', 'disabled');
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        break;

      case 'valid':
        button.removeAttribute('disabled');
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        break;

      case 'loading':
        button.setAttribute('disabled', 'disabled');
        input.classList.remove('is-valid', 'is-invalid');
        input.classList.add('none');
        input.setAttribute('readonly', 'readonly');
        // добавить колесико прокрутки
        break;

      case 'duplicate':
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        console.log(state.feedslist);
        // рамку подсветить желтым

        break;

      case 'error':// если ссылка вернула ошибку
        button.removeAttribute('disabled');
        input.classList.add('none');
        input.classList.remove('is-valid', 'is-invalid');
        input.removeAttribute('readonly', 'readonly');
        whenError();

        break;
      default:
        break;
    }
  };

  watch(state, 'process', processState);
};
