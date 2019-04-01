import makeRequest from './scripts/makeRequest';


export default () => {
  const input = document.querySelectorAll('input');
  const rss = makeRequest(input);
  console.log(rss);
};
