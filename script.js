const movies = [
    {
        rank: 1,
        title: "Pobres criaturas",
        year: 2023,
        poster: "/api/placeholder/80/120",
        tags: ["Drama", "Sci-Fi", "Romance"],
        description: "A story of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter."
    },
    {
        rank: 2,
        title: "Spider-Man: Cruzando el Multiverso",
        year: 2023,
        poster: "/api/placeholder/80/120",
        tags: ["Animation", "Action", "Adventure"],
        description: "Miles Morales returns for an epic adventure that will transport Brooklyn's full-time, friendly neighborhood Spider-Man across the Multiverse."
    },
    {
        rank: 3,
        title: "La sociedad de la nieve",
        year: 2023,
        poster: "/api/placeholder/80/120",
        tags: ["Drama", "Biography", "Survival"],
        description: "A Uruguayan rugby team stranded in the Andes after their plane crashes must take extreme measures to survive."
    },
    {
        rank: 4,
        title: "Oppenheimer",
        year: 2023,
        poster: "/api/placeholder/80/120",
        tags: ["Biography", "Drama", "History"],
        description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."
    }
];

const searchMovies = async (query) => {
    // Simulating API call - replace with actual API integration
    return [
        {
            title: "Example Movie 1",
            year: 2023,
            poster: "/api/placeholder/80/120",
            tags: ["Drama", "Action"],
            description: "Example movie description 1"
        },
        {
            title: "Example Movie 2",
            year: 2022,
            poster: "/api/placeholder/80/120",
            tags: ["Comedy", "Romance"],
            description: "Example movie description 2"
        }
    ].filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
    );
};

function renderMovies() {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <div class="rank">${movie.rank}</div>
            <img class="movie-poster" src="${movie.poster}" alt="${movie.title}">
            <div class="movie-info">
                <div class="title-row">
                    <h3>${movie.title}</h3>
                    <span class="year">(${movie.year})</span>
                </div>
                <div class="tags">
                    ${movie.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="description">${movie.description}</div>
                <button class="rerank-btn">Rerank</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.rerank-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => handleRerank(index));
    });
}

function handleRerank(index) {
    console.log(`Reranking movie at index ${index}`);
}

function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Movie to Ranking</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search for a movie...">
                </div>
                <div class="search-results"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    const searchInput = modal.querySelector('.search-input');
    const searchResults = modal.querySelector('.search-results');
    const closeBtn = modal.querySelector('.close-modal');
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = await searchMovies(query);
            displaySearchResults(results, searchResults);
        }, 300);
    });
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

function displaySearchResults(results, container) {
    container.innerHTML = results.map(movie => `
        <div class="search-result">
            <img src="${movie.poster}" alt="${movie.title}" class="result-poster">
            <div class="result-info">
                <h3>${movie.title} (${movie.year})</h3>
                <div class="result-tags">
                    ${movie.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="result-description">${movie.description}</p>
                <button class="add-movie-btn">Add to Ranking</button>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.add-movie-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            addMovieToRanking(results[index]);
            document.querySelector('.search-modal').remove();
        });
    });
}

function addMovieToRanking(movie) {
    // Check if movie already exists in the list
    const movieExists = movies.some(existingMovie => 
        existingMovie.title.toLowerCase() === movie.title.toLowerCase() && 
        existingMovie.year === movie.year
    );

    if (movieExists) {
        // Create and show error message
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = `"${movie.title}" is already in your ranking`;
        document.body.appendChild(errorToast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            errorToast.remove();
        }, 3000);

        return;
    }

    // If movie doesn't exist, add it with the next rank
    const newRank = movies.length + 1;
    movies.push({
        ...movie,
        rank: newRank
    });
    renderMovies();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
    
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    // Add Movie button
    const header = document.querySelector('.header');
    const addButton = document.createElement('button');
    addButton.className = 'filter-btn';
    addButton.textContent = 'Add Movie';
    addButton.addEventListener('click', () => {
        createSearchModal();
    });
    header.appendChild(addButton);
});