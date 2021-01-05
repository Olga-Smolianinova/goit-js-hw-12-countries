// Получаем доступ к шаблону
import template from '../templates/users.hbs';

// Доступы к элементам
const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('.form'),
};

// Для того чтобы работала поисковая строка, сначала вешаем слушателя событий на форму и получаем доступ к тому, что введет пользователь в input, обратившись к  event.currentTarget.elements.query.value
refs.form.addEventListener('submit', event => {
  event.preventDefault();

  const inputValue = event.currentTarget.elements.query.value;
  console.log(inputValue);

  // чтобы при добавлении новой информации поиска предыдущий список не показывался и обновлялся прописываем:
  refs.container.innerHTML = '';

  // чтобы очищались данные input:
  refs.form.reset();

  fetchUsers(inputValue);
});

function fetchUsers(searchQuery) {
  // Формат запроса. Можно специально не прописивать, браузер делает это по умолчанию. Если API не публичный и нужна авторизация и ключ, в таком случае нужно дописывать в headers свойство Authorization: key
  const options = {
    method: 'GET', //HTTP-метод
    headers: {
      //Заголовок
      Accept: 'application/json', //чтобы принять данные в формате JSON
    },
  };

  // Для того чтобы поиск происходил по данным, которые приходят от пользователя  в input, в параметрах https://jsonplaceholder.typicode.com/users' можно дописать ${inputValue} .вместо users. В данном случае и функции это будет параметр searchQuery .
  fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`, options)
    .then(response => response.json())
    .then(data => {
      updateUsers(data); //чтобы не смешивать две разных функции в одной, встраивание по шаблону выводим в отдельную функции и переиспользуем ее здесь в fetch
      console.log(data);
    })
    .catch(error => console.log(error));
}

function updateUsers(data) {
  // подставляем данные в шаблон
  const markup = template(data);
  // console.log(markup);

  // встраиваем полученные данные в HTML документ
  refs.container.insertAdjacentHTML('beforeend', markup);
}

// ссылка на публичные api
// github.com/public-apis/public-apis
