export const randomIdGenerator = (title, index) => {
  const id = title.split(' ').join('').substr(1, 12);
  const random = Math.random().toString(36).substr(2, 25);
  const clearId = `${id.replace(/[.,/#!$%^&*;:'’{}=\-_`~()]/g, '')}${index}`;
  return `${index}${clearId}${random}`;
};

export const cleaning = (button, successTag, input, y = 0) => {
  // eslint-disable-next-line no-param-reassign
  if (y === 0) successTag.innerHTML = '';
  button.removeAttribute('disabled');
  input.classList.add('none');
  input.classList.remove('is-valid', 'is-invalid');
  input.removeAttribute('readonly', 'readonly');
};

export const eventLoader = (event, message) => {
  const parent = document.querySelector(`#${event}`);
  const tag = `
    <div class="alert alert-${event} alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span></button>
        ${message}
</div> `;
  const div = document.createElement('div');
  div.innerHTML = tag;
  parent.appendChild(div);
};
