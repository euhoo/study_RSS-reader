import { randomIdGenerator } from './utils';

export default (item, index = 123) => {
  const href = item.querySelector('link').textContent;
  const title = item.querySelector('title').textContent;
  const description = item.querySelector('description').textContent;

  
  /* here was only index and title using id-generator but it don't work when feeds updating */

  const id = randomIdGenerator(title, index);

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
