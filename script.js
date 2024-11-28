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
});