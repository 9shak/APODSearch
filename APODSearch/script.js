document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('dateForm');
  const apodContainer = document.getElementById('apodContainer');
  const favoritesContainer = document.getElementById('favoritesContainer');

  form.addEventListener('submit', function (e) {
      e.preventDefault();
      const dateInput = document.getElementById('dateInput').value;

      fetch(`https://api.nasa.gov/planetary/apod?api_key=ExBhuQmaOC9Ode4l3MPbS0og2RRNbJR7ee9aBwJ9&date=${dateInput}`)
          .then(response => response.json())
          .then(data => {
              displayApod(data);
              apodContainer.classList.remove('hidden');
          })
          .catch(error => console.error('Error fetching APOD:', error));
  });

  function displayApod(data) {
      const { url, title, date, explanation, hdurl } = data;

      const apodHTML = `
          <h2>${title}</h2>
          <p>Date: ${date}</p>
          <p>${explanation}</p>
          <img src="${url}" alt="${title}" id="apodImage" class="img-fluid">
      `;

      apodContainer.innerHTML = apodHTML;

      const apodImage = document.getElementById('apodImage');
      apodImage.addEventListener('click', function () {
          window.open(hdurl, '_blank');
      });

      if (isFavorite(url)) {
          apodContainer.innerHTML += '<p class="text-success">This image is in your favorites.</p>';
      } else {
          const favoriteButton = document.createElement('button');
          favoriteButton.textContent = 'Add to Favorites';
          favoriteButton.classList.add('btn', 'btn-primary', 'mt-3');
          favoriteButton.addEventListener('click', function () {
              addToFavorites({ url, title, date, explanation, hdurl });
          });
          apodContainer.appendChild(favoriteButton);
      }
  }

  function addToFavorites(apod) {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites.push(apod);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      displayFavorites();
  }

  function displayFavorites() {
      favoritesContainer.innerHTML = '<h2>Favorites</h2>';

      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      favorites.forEach(apod => {
          const favoriteImage = document.createElement('img');
          favoriteImage.src = apod.url;
          favoriteImage.alt = apod.title;
          favoriteImage.classList.add('img-thumbnail', 'mb-2');
          favoriteImage.addEventListener('click', function () {
              window.open(apod.hdurl, '_blank');
          });

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Remove from Favorites';
          deleteButton.classList.add('btn', 'btn-danger', 'ml-2', 'mt-2');
          deleteButton.addEventListener('click', function () {
              removeFromFavorites(apod.url);
          });

          const favoriteItem = document.createElement('div');
          favoriteItem.classList.add('mb-3');
          favoriteItem.appendChild(favoriteImage);
          favoriteItem.appendChild(deleteButton);
          favoritesContainer.appendChild(favoriteItem);
      });
  }

  function removeFromFavorites(url) {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites = favorites.filter(apod => apod.url !== url);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      displayFavorites();
  }

  function isFavorite(url) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      return favorites.some(apod => apod.url === url);
  }

  displayFavorites();
});
