/* eslint-disable no-param-reassign */
import axios from 'axios';
import { difference } from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, 'application/xml');
};

const findNewFeeds = (newFeeds, oldFeeds) => {
  const newFeedsLinks = newFeeds.map(feed => feed.querySelector('link').textContent);
  const OldFeedsLinks = oldFeeds.map(feed => feed.querySelector('link').textContent);
  const diff = difference(newFeedsLinks, OldFeedsLinks);
  return newFeeds.filter(item => diff.includes(item.querySelector('link').textContent));
};

const updateQuery = (state) => {
  axios.all(state.feedLinks.map(link => axios.get(link)))
    .then((allFeeds) => {
      const newFeeds = [...allFeeds.reduce((acc, feed) => [parse(feed.data), ...acc], [])]
        .map(doc => [...doc.querySelectorAll('item')])
        .flat();
      const feedsToAdd = findNewFeeds(newFeeds, state.feeds);
      if (feedsToAdd.length > 0) {
        state.feeds = [...feedsToAdd, ...state.feeds];
      }
    })
    .catch(() => {
      state.processState = 'error';
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
