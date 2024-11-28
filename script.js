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

// Rendering Functions
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

// Comparison Modal Functions
function createComparisonModal(movieToRank, comparisonMovie, isReranking = false) {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isReranking ? 'Rerank Movie' : 'Compare Movies'}</h2>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center;">
                    <div class="movie-comparison">
                        <img src="${movieToRank.poster}" alt="${movieToRank.title}" class="movie-poster">
                        <h3>${movieToRank.title}</h3>
                        <div class="year">(${movieToRank.year})</div>
                    </div>
                    <div style="text-align: center; font-size: 1.2em;">vs</div>
                    <div class="movie-comparison" id="comparison-movie">
                        <img src="${comparisonMovie.poster}" alt="${comparisonMovie.title}" class="movie-poster">
                        <h3>${comparisonMovie.title}</h3>
                        <div class="year">(${comparisonMovie.year})</div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p>Which movie do you prefer?</p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                        <button class="add-movie-btn" id="prefer-left">Prefer Left</button>
                        <button class="add-movie-btn" id="prefer-right">Prefer Right</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

function findRankWithBinarySearch(movieToRank, excludeIndex = -1) {
    return new Promise((resolve) => {
        // Create a temporary array excluding the movie being reranked (if applicable)
        const tempMovies = excludeIndex === -1 ? 
            [...movies] : 
            movies.filter((_, index) => index !== excludeIndex);

        let left = 0;
        let right = tempMovies.length - 1;
        let currentIndex;

        function showComparison() {
            currentIndex = Math.floor((left + right) / 2);
            const comparisonMovie = tempMovies[currentIndex];
            const modal = createComparisonModal(
                movieToRank, 
                comparisonMovie, 
                excludeIndex !== -1
            );

            // Handle user choice
            modal.querySelector('#prefer-left').addEventListener('click', () => {
                modal.remove();
                right = currentIndex - 1;
                if (left > right) {
                    resolve(left);
                } else {
                    showComparison();
                }
            });

            modal.querySelector('#prefer-right').addEventListener('click', () => {
                modal.remove();
                left = currentIndex + 1;
                if (left > right) {
                    resolve(left);
                } else {
                    showComparison();
                }
            });
        }

        if (tempMovies.length === 0) {
            resolve(0);
        } else {
            showComparison();
        }
    });
}

// Search Modal Functions
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

// Ranking Functions
async function addMovieToRanking(movie) {
    // Check if movie already exists
    const movieExists = movies.some(existingMovie => 
        existingMovie.title.toLowerCase() === movie.title.toLowerCase() && 
        existingMovie.year === movie.year
    );

    if (movieExists) {
        const errorToast = document.createElement('div');
        errorToast.className = 'error-toast';
        errorToast.textContent = `"${movie.title}" is already in your ranking`;
        document.body.appendChild(errorToast);
        setTimeout(() => errorToast.remove(), 3000);
        return;
    }

    // Find the appropriate rank using binary search
    const newPosition = await findRankWithBinarySearch(movie);
    
    // Insert the movie at the determined position
    movies.splice(newPosition, 0, {
        ...movie,
        rank: newPosition + 1
    });

    // Update ranks for all movies
    movies.forEach((movie, index) => {
        movie.rank = index + 1;
    });

    renderMovies();
}

async function handleRerank(index) {
    const movieToRerank = movies[index];
    
    // Remove the movie temporarily from the array
    movies.splice(index, 1);
    
    // Find the new position using binary search
    const newPosition = await findRankWithBinarySearch(movieToRerank, index);
    
    // Insert the movie at the new position
    movies.splice(newPosition, 0, movieToRerank);
    
    // Update all ranks
    movies.forEach((movie, index) => {
        movie.rank = index + 1;
    });
    
    renderMovies();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMovies();
    
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
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