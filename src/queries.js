import axios from 'axios';
import { differenceBy, random } from 'lodash';

const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const title = doc.querySelector('title').textContent;
  const items = [...doc.querySelectorAll('item')];
  const feeds = items.map((item) => {
    const id = random(1, 1000000);
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

export const updateQuery = (state) => {
  const promises = state.feedLinks.map(link => axios.get(link));
  axios.all(promises)
    .then((allRssChannels) => {
      const newFeeds = allRssChannels.map(channel => parse(channel.data).feeds)
        .flat();
      const feedsToAdd = differenceBy(newFeeds, state.feeds, 'href');
      // eslint-disable-next-line no-param-reassign
      state.feeds = [...feedsToAdd, ...state.feeds];
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
