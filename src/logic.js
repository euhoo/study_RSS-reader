import WatchJS from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import { cleanClassList, setFrameColor } from './utils';

/*
поправить
1.Чтобы в поле ввода остался один крестик
2.чтобы рамка при пустом поле была нейтральная
3.дубляж
4.разнести все по своим файлам


*/

const { watch } = WatchJS;

export default () => {
/*     model     */
  const state = {
    link: {},
    value: false, // когда начинаем вводить становится true. когда ячейка пуста-вновь false
    correctUrl: true, // false
    error: false, // true здесь мы следим,если введенная ссылка-не rss поток
    buttonState: false, // true - отсюда буду брать свойство-активна кнопка или нет
    inputFrame: 'none', // none/red/green-отсюда вотчим рамку
    currentRss: {}, // текущий rss
    allRss: [],
  };

  /*     controller      */

  const input = document.querySelector('#main-input');
  const button = document.querySelector('#main-button');


  input.addEventListener('input', ({ target }) => {
    state.value = target.value;
    state.correctUrl = isURL(target.value);
    state.buttonState = (state.value.length > 0 && state.correctUrl);
    state.inputFrame = setFrameColor(state);
  });

  button.addEventListener('click', () => {
    const parser = new DOMParser();
    const link = state.value;
    button.setAttribute('placeholder', 'Search');
    const cors = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${cors}${link}`)
      .then(({ data }) => {
        const doc = parser.parseFromString(data, 'application/xml');
        const title = doc.querySelector('title').textContent; // посмотреть как точно искать
        const items = [...doc.querySelectorAll('item')];// посмотреть как точно искать
        state.currentRss = {
          title,
          items,
          value: state.value,
        };
        state.allRss = [state.currentRss, ...state.allRss];
        console.log(state.currentRss);
      })

      .catch(() => {
        state.error = true;
        console.log(state.error);
      });
  });


  const buttonStateFunc = () => {
  // eslint-disable-next-line no-unused-expressions
    button.hasAttribute('disabled') ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'disabled');
  };

  const errorFunc = () => {
    if (state.error === false) return;
    const errorDiv = document.querySelector('#error');
    errorDiv.setAttribute('style', 'display:block;');
    window.setTimeout(() => {
      errorDiv.setAttribute('style', 'display:none;');
    }, 3000);
    state.error = false;
  };


  /*  view  */


  const inputFrameFunc = (st) => {
    cleanClassList(input.classList);
    if (st.inputFrame.length > 0) input.classList.add(st.inputFrame);
  };

  const renderRss = () => {
    const forRss = document.querySelector('#rss');
    const rssObj = state.currentRss;
    const rssParser = new DOMParser();
    const mainDivStr = `
  <div class="container-fluid w-100">
  <div class="row no-gutters">
  <div id="title" class="col-12">
      <h2>${rssObj.title}</h2>
  </div>
  <div id="content" class="col-12">
  </div>
</div>
</div>`;
    const doc = rssParser.parseFromString(mainDivStr, 'text/html');
    const top = doc.querySelector('.container-fluid');
    const divRss = doc.querySelector('#content');
    rssObj.items.forEach((item) => {
      const text = item.querySelector('title').textContent;
      const href = item.querySelector('link').textContent;
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.innerHTML = text;
      const div = document.createElement('li');
      div.classList.add('col-12');
      div.append(a);
      divRss.append(div);
    });
    console.log(doc);
    forRss.appendChild(top);
  };

  watch(state, 'inputFrame', () => inputFrameFunc(state));
  watch(state, 'buttonState', buttonStateFunc);
  watch(state, 'error', errorFunc);
  watch(state, 'currentRss', renderRss);
};
