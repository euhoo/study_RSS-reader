import axios from 'axios';
import { difference } from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const items = [...doc.querySelectorAll('item')];
  const feeds = items.map((item) => {
    const id = Math.random().toString(36).substr(2, 25);
    const href = item.querySelector('link').textContent;
    const feedTitle = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const feed = {
      href, feedTitle, description, id,
    };
    return feed;
  });
  return { title, feeds };
};

const findNewFeeds = (newFeeds, oldFeeds) => {
  const newFeedsLinks = newFeeds.map(feed => feed.href);
  const OldFeedsLinks = oldFeeds.map(feed => feed.href);
  const diff = difference(newFeedsLinks, OldFeedsLinks);
  return newFeeds.filter(feed => diff.includes(feed.href));
};

export const updateQuery = (state) => {
  const promises = state.feedLinks.map(link => axios.get(link));
  axios.all(promises)
    .then((allRssChannels) => {
      const newFeeds = allRssChannels.map(channel => parse(channel.data).feeds)
        .flat();
      const feedsToAdd = findNewFeeds(newFeeds, state.feeds);
      if (feedsToAdd.length > 0) {
        // eslint-disable-next-line no-param-reassign
        state.feeds = [...feedsToAdd, ...state.feeds];
      }
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
      const { title, feeds } = doc;
      // eslint-disable-next-line no-param-reassign
      state.channelTitles = [title, ...state.channelTitles];
      // eslint-disable-next-line no-param-reassign
      state.feedLinks = [...state.feedLinks, url];
      // eslint-disable-next-line no-param-reassign
      state.feeds = [...feeds, ...state.feeds];
    })
    .catch(() => {
      // eslint-disable-next-line no-param-reassign
      state.processState = 'error';
    });
};
