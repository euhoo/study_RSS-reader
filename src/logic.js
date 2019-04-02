import WatchJS from 'melanke-watchjs';
import $ from 'jquery';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import { cleanClassList, setFrameColor } from './utils';

const { watch } = WatchJS;
/*     model     */
const state = {
  link: {},
  value: false, // когда начинаем вводить становится true. когда ячейка пуста-вновь false
  correctUrl: true, // false
  error: false, // true здесь мы следим,если введенная ссылка-не rss поток
  errorShown: true, // показывает,показало ли ошибку
  buttonState: false, // true - отсюда буду брать свойство-активна кнопка или нет
  inputFrame: 'none', // none/red/green-отсюда вотчим рамку
  currentRss: {}, // текущий rss
  allRss: [],
};
const input = document.querySelector('#main-input');
const button = document.querySelector('#main-button');

/*     controller      */

export default () => {
  input.addEventListener('input', ({ target }) => {
    state.value = (target.value.length > 0);
    state.correctUrl = isURL(target.value);
    state.buttonState = (state.value && state.correctUrl);
    console.log(state.buttonState);
    state.inputFrame = setFrameColor(state);
  });
};

const buttonStateFunc = () => {
  // eslint-disable-next-line no-unused-expressions
  button.hasAttribute('disabled') ? button.removeAttribute('disabled') : button.setAttribute('disabled', 'disabled');
};


/*  view  */


const inputFrameFunc = (st) => {
  cleanClassList(input.classList);
  if (st.inputFrame.length > 0) input.classList.add(st.inputFrame);
};

watch(state, 'inputFrame', () => inputFrameFunc(state)); // готово
watch(state, 'buttonState', buttonStateFunc);
