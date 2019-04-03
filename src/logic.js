/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import makeRequest from './request';
import { cleanClassList, setFrameColor, makeTemporyVisible } from './utils';

/*
поправить

4.разнести все по своим файлам
5.очистка поля после нажатия
6.добавить по событию нажатию на enter

*/

const { watch } = WatchJS;

export default () => {
/*     model     */
  const state = {
    value: false, // когда начинаем вводить становится true. когда ячейка пуста-вновь false
    correctUrl: true, // false
    error: false, // true здесь мы следим,если введенная ссылка-не rss поток
    buttonState: false, // true - отсюда буду брать свойство-активна кнопка или нет
    inputFrame: 'none', // none/red/green-отсюда вотчим рамку
    currentRss: {}, // текущий rss
    allRss: [], // все ссылки на все rss страницы
  };

  /*     controller      */

  const input = document.querySelector('#main-input');
  const button = document.querySelector('#main-button');

  const buttonStateFunc = () => {
    button.hasAttribute('disabled') ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'disabled');
  };

  const makeButtonTemporalBlocked = (delay) => {
    buttonStateFunc();
    window.setTimeout(() => {
      buttonStateFunc();
    }, delay);
  };


  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    state.correctUrl = isURL(target.value);
    state.buttonState = (state.value.length > 0 && state.correctUrl);
    state.inputFrame = setFrameColor(state);
  });

  button.addEventListener('click', () => {
    makeButtonTemporalBlocked(2000);
    const link = state.value;
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = `${cors}${link}`;
    makeRequest(url, state);
  });

  const errorStateFunc = () => {
    if (state.error === false) return;
    makeTemporyVisible('#error', 3000);
    state.error = false;
  };

  /*  view  */

  const inputFrameFunc = (st) => {
    cleanClassList(input.classList);
    if (st.inputFrame.length > 0) input.classList.add(st.inputFrame);
  };
  const renderRss = () => {
    const filtered = state.allRss.filter(item => item === state.value);
    if (filtered.length > 0) {
      makeTemporyVisible('#have', 1000);
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
    makeTemporyVisible('#added', 1000);
  };

  watch(state, 'inputFrame', () => inputFrameFunc(state));
  watch(state, 'buttonState', buttonStateFunc);
  watch(state, 'error', errorStateFunc);
  watch(state, 'currentRss', renderRss);
};
