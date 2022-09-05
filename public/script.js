//This script fulfills the project reqs for "Kelvin Weather" in Codecademy
//This script is to be ran in conjunction with helpers.js, style.css, and index.html

const tmdbKey = "";
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const playBtn = document.getElementById("playBtn");

const getGenres = async () => {
  const genreRequestEndpoint = "/genre/movie/list";
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      //console.log(jsonResponse);  check jsonResponse
      const genres = jsonResponse.genres;
      //console.log(genres)  test
      return genres;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovies = async () => {
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = "/discover/movie";
  // 500 is the max allowable page search parameter on tmdb
  const randomPage = Math.floor(Math.random() * 500);
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${randomPage}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movies = jsonResponse.results;
      return movies;
    }
  } catch (error) {
    console.log(error);
  }
};

const getMovieInfo = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const movieInfo = jsonResponse;

      return movieInfo;
    }
  } catch (error) {
    console.log(error);
  }
};


// Get Movie Ratings
const getRating = async (movie) => {
  const movieId = movie.id;
  const movieEndpoint = `/movie/${movieId}`;
  const requestParams = `?api_key=${tmdbKey}&language=en-US&append_to_response=release_dates`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      rating =
        jsonResponse.release_dates.results[0].release_dates[0].certification;
      if (rating === "") {
        return "Not Rated";
      } else {
        return `Rated: ${rating}`;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Add movie to liked movie list(but not displayed)
const addToLikedMovies = (movieInfo) => {
  let likedMovies = "";
  likedMovies += movieInfo + ", ";
  //console.log(likedMovies)
  displayLikedMovies(likedMovies);
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById("movieInfo");
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  }
  const movies = await getMovies();
  const randomMovie = await getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  const rating = await getRating(randomMovie);
  console.log(rating);
  displayMovie(info, rating);
};

//getMovies();
getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;
