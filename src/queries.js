/* eslint-disable no-param-reassign */
import axios from 'axios';
import { difference } from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

const updateQuery = (state) => {
  const links = state.feedLinks;
  axios.all(links.map(link => axios.get(link)))
    .then((allFeeds) => {
      const documents = [...allFeeds.reduce((acc, feed) => [parse(feed.data), ...acc], [])];
      const newFeeds = [...documents.map(doc => [...doc.querySelectorAll('item')])].flat();
      const existItems = state.currentFeed;
      const mappedNewFeeds = newFeeds.map(feed => feed.querySelector('link').textContent);
      const mappedOldFeeds = existItems.map(feed => feed.querySelector('link').textContent);
      const diff = difference(mappedNewFeeds, mappedOldFeeds);
      const feedsToAdd = newFeeds.filter(item => diff.includes(item.querySelector('link').textContent));
      console.log(feedsToAdd);
      if (feedsToAdd.length > 0) {
        state.currentFeed = [...feedsToAdd, ...state.currentFeed];
      }
    });
};
export default (url, state) => {
  let link;
  axios.get(url)
    .then(({ data }) => {
      state.processState = 'init';
      const doc = parse(data);
      const title = doc.querySelector('title').textContent;
      const items = [...doc.querySelectorAll('item')];
      state.feedLinks = [...state.feedLinks, url];
      state.currentFeed = [...state.currentFeed, ...items];
      link = url;
    })
    .catch(() => {
      state.processState = 'error';
    })
    .finally(() => {
      if (link) {
        setInterval(() => {
          updateQuery(state);
        }, 5000);
      }
    });
};
