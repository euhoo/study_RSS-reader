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
      const newFeeds = [...allFeeds.reduce((acc, feed) => [parse(feed.data), ...acc], [])]
        .map(doc => [...doc.querySelectorAll('item')])
        .flat();
      const existItems = state.feeds;
      const mappedNewFeeds = newFeeds.map(feed => feed.querySelector('link').textContent);
      const mappedOldFeeds = existItems.map(feed => feed.querySelector('link').textContent);
      const diff = difference(mappedNewFeeds, mappedOldFeeds);
      const feedsToAdd = newFeeds.filter(item => diff.includes(item.querySelector('link').textContent));
      if (feedsToAdd.length > 0) {
        state.feeds = [...feedsToAdd, ...state.feeds];
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
      state.channelTitles = [title, ...state.channelTitles];
      state.feedLinks = [...state.feedLinks, url];
      state.feeds = [...items, ...state.feeds];
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
