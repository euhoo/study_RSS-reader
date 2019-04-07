import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './app';

app();


/*
  const renderRss = () => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="row no-gutters">
      <div  class="col-12">
        <h2 id="rss-title></h2>
      </div>
      <div id="tag-to-add" class="col-12 w-100">
      </div>
    </div>`;
    const rssDiv = document.querySelector('#rss');
    rssDiv.appendChild(div);
  };
  */