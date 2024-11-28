// Configuration settings for the movie ranking application
const config = {
    // API Configuration
    api: {
        key: 'API_KEY',
        baseUrl: 'https://api.themoviedb.org/3',
        posterBaseUrl: 'https://image.tmdb.org/t/p/w500',
    },
    
    // Application settings
    app: {
        maxSearchResults: 5,
        initialMovieCount: 10,
        searchDebounceTime: 300, // milliseconds
        toastDuration: 3000, // milliseconds
    },
    
    // Language settings
    language: 'en-US',
};

export default config;