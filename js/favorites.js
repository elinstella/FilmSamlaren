function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const container = document.getElementById('favorites-container');

    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p class="favorites-message">Inga favoriter har lagts till ännu.</p>';
        return;
    }

    favorites.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
            <button class="remove-favorite-btn">Ta bort som favorit</button>
            <div class="confirmation-btn" style="display: none;">
                <button class="confirm-remove-btn">Är du säker? Klicka för att ta bort.</button>
            </div>
        `;

        // Lägg till eventlyssnare för "Ta bort som favorit"-knappen
        const removeButton = movieElement.querySelector('.remove-favorite-btn');
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Förhindra att popup visas vid klick på "Ta bort"-knappen
            showConfirmation(movieElement);
        });

        // Lägg till eventlyssnare för "Bekräfta borttagning"-knappen
        const confirmRemoveButton = movieElement.querySelector('.confirm-remove-btn');
        confirmRemoveButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Förhindra att popup visas vid klick på "Bekräfta"-knappen
            removeFavorite(movie, movieElement);
        });

        // Lägg till eventlyssnare för att visa popup när man klickar på filmen
        movieElement.addEventListener('click', () => showMoviePopup(movie.id));

        container.appendChild(movieElement);
    });
}

function showConfirmation(movieElement) {
    const confirmationDiv = movieElement.querySelector('.confirmation-btn');
    const removeButton = movieElement.querySelector('.remove-favorite-btn');

    removeButton.style.display = 'none';
    confirmationDiv.style.display = 'block';
}

async function showMoviePopup(movieId) {
    try {
        const apiKey = 'a5386f918776f921b00e4d085cadf0a1';
        const baseUrl = 'https://api.themoviedb.org/3';
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

function removeFavorite(movie, movieElement) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieIndex = favorites.findIndex(fav => fav.id === movie.id);

    if (movieIndex !== -1) {
        favorites.splice(movieIndex, 1); 
        localStorage.setItem('favorites', JSON.stringify(favorites)); 

        movieElement.remove();

        if (favorites.length === 0) {
            const container = document.getElementById('favorites-container');
            container.innerHTML = '<p class="favorites-message">Inga favoriter har lagts till ännu.</p>';
        }        
    }
}

displayFavorites();

