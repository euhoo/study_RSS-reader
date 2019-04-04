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
