import axios from 'axios';
// import isURL from 'validator/lib/isURL';
// import WatchJS from 'melanke-watchjs';


// const { watch } = WatchJS;
const input = document.querySelector('input');
export default () => {
  input.addEventListener('input', ({ target }) => {
    const parser = new DOMParser();
    const link = target.value;
    const cors = 'https://cors-anywhere.herokuapp.com/';
    axios.get(`${cors}${link}`)
      .then(({ data }) => {
        const document = parser.parseFromString(data, 'application/xml');
        console.log(document);
      });
  });
};
/*
watch(state, 'error', () => {
  console.log('error mazafaka');
});
watch(state, 'link', () => {
  console.log('error mazafaka');
});

const state = {
  title: [],
  content: [],
  error: '',
  link: '',
};
*/
