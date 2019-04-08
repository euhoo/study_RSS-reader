import axios from 'axios';
import { difference } from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const items = [...doc.querySelectorAll('item')];
  return { title, items };
};

const findNewFeeds = (newFeeds, oldFeeds) => {
  const newFeedsLinks = newFeeds.map(feed => feed.querySelector('link').textContent);
  const OldFeedsLinks = oldFeeds.map(feed => feed.querySelector('link').textContent);
  const diff = difference(newFeedsLinks, OldFeedsLinks);
  return newFeeds.filter(item => diff.includes(item.querySelector('link').textContent));
};

export const updateQuery = (state) => {
  axios.all(state.feedLinks.map(link => axios.get(link)))
    .then((allFeeds) => {
      const newFeeds = [...allFeeds.reduce((acc, feed) => [parse(feed.data).items, ...acc], [])]
        .flat();
      const feedsToAdd = findNewFeeds(newFeeds, state.feeds);
      if (feedsToAdd.length > 0) {
        // eslint-disable-next-line no-param-reassign
        state.feeds = [...feedsToAdd, ...state.feeds];
      }
    })
    .catch(() => {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'error';
    })
    .finally(() => {
      setInterval(() => {
        updateQuery(state);
      }, 5000);
    });
};

export default (url, state) => {
  axios.get(url)
    .then(({ data }) => {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'init';
      const doc = parse(data);
      const { title, items } = doc;
      // eslint-disable-next-line no-param-reassign
      state.channelTitles = [title, ...state.channelTitles];
      // eslint-disable-next-line no-param-reassign
      state.feedLinks = [...state.feedLinks, url];
      // eslint-disable-next-line no-param-reassign
      state.feeds = [...items, ...state.feeds];
    })
    .catch(() => {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'error';
    });
};
