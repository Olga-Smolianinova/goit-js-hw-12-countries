// Доступы к элементам
import refs from '../modul-12/refs.js';

// Доступ к функции для встраивания данных с бекенда  через шаблон в HTML
import updateArticles from './updateArticles.js';

// Доступ к файлу servise, который дополнительно будет обрабатывать API-запрос
import servise from './servise.js';
// ==============================================================================
//  можно вынести объект loadMore в отдельный файл и экспортировать его в этот
const loadMore = {
  enable() {
    // для варианта работы спиннера через bootstrap, чтобы при выполнении HTTP-запроса кнопка "Показать еще" была  not disabled
    refs.loadMoreBtn.disabled = false;

    // возвращаем обратно вместо  "Загружаем..." на Показать еще"
    refs.loadMoreBtnLabel.textContent = 'Показать еще';

    // когда загрузилась страница спиннер добавляем:
    refs.loadMoreBtnSpinner.classList.add('is-hidden');
  },
  disable() {
    // для варианта работы спиннера через bootstrap, чтобі не жонглировать кнопками, снимать-удалять классы, чтобы перед выполнением HTTP-запроса кнопка "Показать еще" была disabled
    refs.loadMoreBtn.disabled = true;

    // меняем "Показать еще" на "Загружаем..."
    refs.loadMoreBtnLabel.textContent = 'Загружаем...';

    // перед выполнением HTTP-запроса спиннер прячем:
    refs.loadMoreBtnSpinner.classList.remove('is-hidden');
  },
  showBtnLoadMore() {
    // изначально кнопка "Показать еще" скрыта, показываем ее после первого http-запроса
    refs.loadMoreBtn.classList.remove('is-hidden');
  },
};

// Для того чтобы работала поисковая строка, сначала вешаем слушателя событий на форму и получаем доступ к тому, что введет пользователь в input, обратившись к  event.currentTarget.elements.query.value в функции onSearchFormSubmit
refs.form.addEventListener('submit', onSearchFormSubmit);

function onSearchFormSubmit(event) {
  event.preventDefault();

  //данные из input, обрабатываются методами get/set из файла servise.js
  servise.query = event.currentTarget.elements.query.value;
  console.log(servise.query);

  // чтобы при добавлении новой информации поиска предыдущий список не показывался и обновлялся прописываем:
  refs.container.innerHTML = '';

  // для того чтобы при нажатии на submit отправлялся новый запрос, а не продолжалось действие page+=1 добавляем метод resetPage, который прописан в файле servise.js :
  servise.resetPage();

  // обрабатваем запрос из input, встраиваем в шаблон и отображаем в HTML с помощью функции onFetch

  onFetch();

  // чтобы очищались данные input:
  refs.form.reset();
}

//==================================================================================
// function fetchArticles(searchQuery) {
//   // можно для удобства эту функцию fetchArticles вынести в отдельный файл
//   // Формат запроса. Можно специально не прописивать, браузер делает это по умолчанию. Если API не публичный и нужна авторизация и ключ, в таком случае нужно дописывать в headers свойство Authorization: key
//   const apiKey = '4330ebfabc654a6992c2aa792f3173a3';
//   const url = `http://newsapi.org/v2/everything?q=${searchQuery}&language=en`;
//   const options = {
//     method: 'GET', //HTTP-метод
//     headers: {
//       //Заголовок
//       Accept: 'application/json', //чтобы принять данные в формате JSON
//       Authorization: apiKey,
//     },
//   };

//   // Поиск происходит по данным, которые приходят от пользователя  в input. В данном случае это будет ключ searchQuery, который обрабатывается методами get/set из файла servise.js .
//   return fetch(url, options)
//     .then(response => response.json())
//     .then(({ articles }) => {
//       articles; //чтобы не смешивать две разных функции в одной, встраивание по шаблону выводим в отдельную функции updateArticles b и выносим ее в отдельеый файл updateArticles.js, и переиспользуем ее здесь в fetch. Также деструктуризируем data, в данном случае то что приходит с бекенда это {articles}
//       console.log(articles);
//     })
//     .catch(error => console.log(error));
// }

// для переиспользования в других файлах (например в servise.js) экспортируем эту функцию
// export default fetchArticles;

// для дозагрузки информации (рестпагинация) вешаем слушателя события на кнопку "Показать еще" и прописываем как обрабатывать HTTP-запрос:
refs.loadMoreBtn.addEventListener('click', onFetch);

// для удобства и чистоты кода создаем отдельную функцию, т.к. код с отображением кнопки "Показать еще" и работой спиннера дублируется :
function onFetch() {
  //1. перед HTTP-запросом скрываем кнопку "Показать еще" и запускаем спиннер
  // чтобы пока идет HTTP-запрос и работает спиннер кнопка "Показать еще" была скрыта
  // refs.loadMoreBtn.classList.add('is-hidden');

  // при нажатии на кнопку"Показать еще" запускаем спиннер:
  // refs.spinner.classList.remove('is-hidden');

  loadMore.disable(); //работа спиннера. Вариант 2

  // 2. запуск HTTP-запроса, который если все ок с помощью updateArticles(articles), отображает кнопку "Показать еще" и finally прячет спиннер;
  // добавляем также доступ к файлу servise, который дополнительно будет обрабатывать API-запрос

  servise
    .fetchArticles()

    .then(articles => {
      updateArticles(articles);

      // когда загрузили информацию и спиннер отработал возвращаем на экран кнопку "Показать еще"
      // refs.loadMoreBtn.classList.remove('is-hidden');

      // изначально кнопка "Показать еще" скрыта, показываем ее после первого http-запроса:
      loadMore.showBtnLoadMore();

      loadMore.enable(); //работа спиннера. Вариант 2

      // Метод window.scrollTo позволяет сделать плавную прокрутку.
      // когда успешно все загрузилось, чтобы прокрутить до самого низа окно. Это стоит делать  в том случае, если знаем что загрузжается указанное колчиство элементов на странице. Чтобы прокрутить на всю высоту до самого низа документа:
      window.scrollTo({
        // top: 10000000,
        // чтобы не прописывать рандомное число для корректной прокрутки, указем свойство, которое отвечает за всю высоту документа offsetHeight:
        top: document.documentElement.offsetHeight,
        behavior: 'smooth',
      });
    });
  //     .finally(() => {
  //       // при завершении HTTP-запроса спиннер скрываем:
  //       // refs.spinner.classList.add('is-hidden');
  //     });
}

// для дозагрузки информации не по кнопке "Показать еще", а при scroll - можно подключить плагин Infinite scroll. Если вручную - через 'scroll' (oldshool); более новый - 'intersectionObserver'.

// Pagination - нумерация страниц как в интернет - магазинах; подключается через  Pagination plagin

// Альтернатива - установить  как npm пакет spin.js (уже готовый спиннер с html-разметкой и css)

// для того чтобы не прописывать лишний код, когда подключаем и отключаем class="is=hidden" действия спиннера могут отображаться непосредственно на самой кнопке. Для дизайна лучше изменить состояние кнопки, чем писать код для лишнего элемента
