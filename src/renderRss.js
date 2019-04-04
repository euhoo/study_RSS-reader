export default (item, index) => {
  const href = item.querySelector('link').textContent;
  const title = item.querySelector('title').textContent;
  const description = item.querySelector('description').textContent;
  const feedStr = `
      <li class="col-12">
        <a href="${href}">
          ${title}
        </a>
        <a href="#" class="nav-link modalWindow" data-toggle="modal" data-target="#modal${index}">Open</a>
      </li>
      <div class="modal fade" id="modal${index}" tabindex="-1" role="dialog" aria-labelledby="modalWindow"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="modalWindowLabel${index}">${title}</h5>
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
  return feedStr;
};
