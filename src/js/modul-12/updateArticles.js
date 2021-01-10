// Доступы к элементам
import refs from '../modul-12/refs.js';

// Получаем доступ к шаблону
import template from '../../templates/articles.hbs';
// ===========================================================

function updateArticles(articles) {
  // подставляем данные в шаблон
  const markup = template(articles);
  // console.log(markup);

  // встраиваем полученные данные в HTML документ
  refs.container.insertAdjacentHTML('beforeend', markup);
}
export default updateArticles;
