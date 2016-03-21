$(function () {
  fetch('https://offline-news-api.herokuapp.com/stories')
  .then(function (response) {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    return response.json();
  })
  .then(function (stories) {
    console.log(stories);
  });
});
