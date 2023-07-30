
import './css/style.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


import searchImages  from './js/api.js';


const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

disable(refs.loadMoreBtn);
refs.formEl.addEventListener('submit', handlerSubmitForm);
refs.loadMoreBtn.addEventListener('click', handlerButtonLoad);



async function handlerSubmitForm(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.searchQuery.value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    Notiflix.Notify.failure(
      'The search field cannot be empty, please try again.'
    );
    return;
  }

  const { hits, totalHits } = await searchImages(searchQuery, currentPage);
  currentHits = hits.length;

     if (totalHits > 40) {
    enable(refs.loadMoreBtn)
  } else {
     disable(refs.loadMoreBtn);
  }

  try {
       if (totalHits > 0) {
          Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.galleryEl.innerHTML = '';
         updatingMarkup(hits);
      lightbox.refresh();
    }
  if (totalHits === 0) {
     refs.galleryEl.innerHTML = '';
       Notify.failure(
         'Sorry, there are no images matching your search query. Please try again.'
       );
       disable(refs.loadMoreBtn);
     }
  } catch (error) {
    console.log(error);
  }

  refs.formEl.reset();
}



function updatingMarkup(arr) {
  const markup = arr.map(item => createMarkup(item)).join('');
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}



async function handlerButtonLoad() {
  currentPage += 1;
  const {hits, totalHits} = await searchImages(searchQuery, currentPage);
  updatingMarkup(response.hits);
  lightbox.refresh();
currentHits += hits.length;
    if (currentHits === totalHits) {
    disable(refs.loadMoreBtn);
  }
}


 function createMarkup (item) {
  return `<div class='photo-card'>
    <a href='${item.largeImageURL}'>
      <img src='${item.webformatURL}' alt='${item.tags}' loading='lazy' />
    </a>
    <div class='info'>
      <p class='info-item'>
        <b>Likes</b>
        ${item.likes}
      </p>
      <p class='info-item'>
        <b>Views</b>
        ${item.views}
      </p>
      <p class='info-item'>
        <b>Comments</b>
        ${item.comments}
      </p>
      <p class='info-item'>
        <b>Downloads</b>
        ${item.downloads}
      </p>
    </div>
  </div>
`;
}

function disable(btn) { 
  btn.classList.add('is-hidden');
}

function enable(btn) { 
  btn.classList.remove('is-hidden');
}