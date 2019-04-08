const renderFeed = (item) => {
  const href = item.querySelector('link').textContent;
  const title = item.querySelector('title').textContent;
  const description = item.querySelector('description').textContent;
  const id = Math.random().toString(36).substr(2, 25);

  return `
        <li class="row">
          <div class="col-12 col-xs-12 col-sm-10 col-md-9 col-lg-10">
          <a href="${href}" class="text-dark .bg-light btn-block">
            ${title}
          </a>
          </div>
          <div class="col-12 col-xs-12 col-sm-2 col-md-3 col-lg-2">
          <button type="button" class="btn btn-outline-success btn-sm btn-block" data-toggle="modal" data-target="#modal${id}">
            Read
          </button>
          </div>
          </li>
          <div class="modal fade" id="modal${id}" tabindex="-1" role="dialog" aria-labelledby="modalWindow"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modalWindowLabel${id}">
                    ${title}
                  </h5>
                  <button class="close" type="button" data-dismiss="modal" aria-label="close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  ${description}
                </div>
              </div>
            </div>
          </div>`;
};
export const renderEvents = (event, message, tag) => {
  // eslint-disable-next-line no-param-reassign
  tag.innerHTML = `
  <div class="alert alert-${event} alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span></button>
      ${message}
  </div> `;
};

export const renderAllFeeds = (state) => {
  const rssDiv = document.querySelector('#rss');
  rssDiv.innerHTML = `
    <div class="row no-gutters">
      <div id="rss-title" class="col-12">
      </div>
      <div id="tag-to-add" class="col-12 w-100">
      </div>
    </div>`;
  const feedsTag = document.querySelector('#tag-to-add');
  const titlesTag = document.querySelector('#rss-title');
  feedsTag.innerHTML = state.feeds.reduce((acc, feed) => [...acc, renderFeed(feed)], []).join('');
  titlesTag.innerHTML = state.channelTitles.reduce((acc, title) => [...acc, `<p><strong>${title}</strong></p>`], []).join('');
};
