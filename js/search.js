const apiKey = 'a5386f918776f921b00e4d085cadf0a1';
const baseUrl = 'https://api.themoviedb.org/3';
let currentPage = 1;
let searchText = '';
let selectedGenre = '';

async function fetchGenres() {
    try {
        const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=sv-SE`);
        const data = await response.json();
        const genreSelect = document.getElementById('genre-select');
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.innerText = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

async function searchMovies(page = 1) {
    try {
        searchText = document.getElementById('search-text').value.trim();
        selectedGenre = document.getElementById('genre-select').value;

        let query = '';
        if (searchText) {
            query = `${baseUrl}/search/movie?api_key=${apiKey}&page=${page}&query=${encodeURIComponent(searchText)}&language=sv-SE`;
        } else {
            query = `${baseUrl}/discover/movie?api_key=${apiKey}&page=${page}&language=sv-SE`;
        }

        const response = await fetch(query);
        
        if (!response.ok) {
            throw new Error('Något gick fel med API-anropet');
        }

        const data = await response.json();
        let filteredMovies = data.results;

        if (selectedGenre) {
            filteredMovies = filteredMovies.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)));
        }

        const moviesToShow = filteredMovies.slice(0, 10); 
        if (moviesToShow.length === 0) {
            showErrorMessage("Inga filmer hittades med den valda sökningen eller genre.");
        } else {
            hideErrorMessage();
            displayMovies(moviesToShow);
            managePagination(data.page, data.total_pages);

            const movieCount = document.getElementById('movie-count');
            if (selectedGenre) {
                movieCount.innerText = `Totalt antal filmer hittade: ${filteredMovies.length}`;
            } else {
                movieCount.innerText = `Totalt antal filmer hittade: ${data.total_results}`;
            }
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        showErrorMessage("Något gick fel när filmerna hämtades. Försök igen senare.");
    }
}

function showErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block'; 
}

function hideErrorMessage() {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.style.display = 'none'; 
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    movies.forEach(movie => {
        const isFavorite = favorites.some(fav => fav.id === movie.id);

        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <button class="favorite-btn ${isFavorite ? 'favorited' : ''}">
                ${isFavorite ? 'Favorit' : 'Lägg till favorit'}
            </button>
        `;

        // Klickhändelse för att visa popup
        movieElement.addEventListener('click', (event) => {
            // Om klicket inte är på favoritknappen, visa popup
            if (!event.target.classList.contains('favorite-btn')) {
                showMoviePopup(movie.id);
            }
        });

        // Klickhändelse för favoritknapp
        const favoriteBtn = movieElement.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Förhindra att popup visas när man klickar på favoritknappen
            toggleFavorite(movie, favoriteBtn);
        });

        movieContainer.appendChild(movieElement);
    });
}

async function showMoviePopup(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=sv-SE`);
        const movie = await response.json();

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-btn">&times;</span>
                <h2>${movie.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <p><strong>Utgivningsdatum:</strong> ${movie.release_date}</p>
                <p><strong>Beskrivning:</strong> ${movie.overview}</p>
                <p><strong>Betydelse:</strong> ${movie.vote_average}/10 (${movie.vote_count} röster)</p>
            </div>
        `;
        popup.querySelector('.close-btn').addEventListener('click', () => {
            popup.remove();
        });

        document.body.appendChild(popup);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function toggleFavorite(movie, button) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieIndex = favorites.findIndex(fav => fav.id === movie.id);

    if (movieIndex === -1) {
        favorites.push(movie);
        button.classList.add('favorited');
        button.innerText = 'Favorit';
    } else {
        favorites.splice(movieIndex, 1);
        button.classList.remove('favorited');
        button.innerText = 'Lägg till favorit';
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function managePagination(current, total) {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.disabled = current === 1;
    nextButton.disabled = current === total;
}

function changePage(direction) {
    currentPage += direction;
    searchMovies(currentPage);
}

document.getElementById('search-text').addEventListener('input', function() {
    currentPage = 1;
    searchMovies(currentPage);
});

document.getElementById('genre-select').addEventListener('change', function() {
    currentPage = 1;
    searchMovies(currentPage);
});

const movieCountElement = document.createElement('p');
movieCountElement.id = 'movie-count';
document.body.insertBefore(movieCountElement, document.getElementById('movie-container'));

fetchGenres();
searchMovies(currentPage);

