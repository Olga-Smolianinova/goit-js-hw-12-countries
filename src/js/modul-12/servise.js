// servise.js - это объект, который отвечает на HTTP-запросы и работает с API-кодом. Хранит в себе данные и методы работы с page и per_page

// из этого файла servise.js будем экспортировать объект, в котором находится fetchArticles(searchQuery), который мы можожем переиспользовать из файла fetchArticles.оы
export default {
  searchQuery: '',
  page: 1,

  fetchArticles() {
    // Формат запроса. Можно специально не прописивать, браузер делает это по умолчанию. Если API не публичный и нужна авторизация и ключ, в таком случае нужно дописывать в headers свойство Authorization: key
    const apiKey = '4330ebfabc654a6992c2aa792f3173a3';
    const url = `http://newsapi.org/v2/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`;
    const options = {
      method: 'GET', //HTTP-метод
      headers: {
        //Заголовок
        Accept: 'application/json', //чтобы принять данные в формате JSON
        Authorization: apiKey,
      },
    };

    // Для того чтобы поиск происходил по данным, которые приходят от пользователя  в input, в параметрах https://jsonplaceholder.typicode.com/users' можно дописать ${inputValue} .вместо users. В данном случае и функции это будет параметр searchQuery .
    return fetch(url, options)
      .then(response => response.json())
      .then(({ articles }) => {
        this.page += 1; //для того чтобы при нажатии на кнопку "Показать еще" подгружалась новая часть запроса на следующей странице
        console.log(articles);
        return articles; //чтобы не смешивать две разных функции в одной, встраивание по шаблону выводим в отдельную функции updateArticles, и переиспользуем ее здесь в fetch. Также деструктуризируем data, в данном случае то что приходит с бекенда это {articles}
      })
      .catch(error => console.log(error));
  },
  //   при изменении запроса при submit начинает отсчет для вывода данных на страницы с page=1
  resetPage() {
    this.page = 1;
  },
  // для того чтобы записывать данные из input в searchQuery обратимся к свойствам get/set, чтобы из внешнего когда записать заначение в этот ключ(
  get query() {
    return this.searchQuery;
  },
  set query(value) {
    this.searchQuery = value;
  },
};
