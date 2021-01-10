// Доступы к элементам
// const container = document.querySelector('.gallery');
// const form = document.querySelector('.form');
// const loadMoreBtn = document.querySelector('[data-action="load-more"]');

// export default { container, form, loadMoreBtn };

const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('.form'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
  loadMoreBtnLabel: document.querySelector(
    'button[data-action="load-more"] >.label',
  ),
  loadMoreBtnSpinner: document.querySelector(
    'button[data-action="load-more"] >.spinner',
  ),
  spinner: document.querySelector('#spinner'),
};

export default refs;
