const movieContainer = document.getElementById('container');

// Handle search event
document.getElementById("search-submit").addEventListener("click", findMovies);

// Get URL parameters to manipulate page behavior
const pageNumUrl = (new URL(window.location.href)).searchParams.get("pagenum");
const searchText = (new URL(window.location.href)).searchParams.get("searchText");
const imdbID = (new URL(window.location.href)).searchParams.get("imdbID");

// If page is loaded due to search, call findMovies
if (searchText != null) {
  this.findMovies();
}

// If page is loaded to show details of specific movie, call getMovieDetails
if (imdbID!=null) {
  this.getMovieDetails(imdbID);
}

// Function to handle search by keyword functionality
function findMovies() {
  var movieSearchText = document.getElementById('search').value;
  var movieUrl = "http://www.omdbapi.com/?s=" + movieSearchText + "&page=1" + "&apikey=a0fb7e73"; // API URL for first time call

  if (searchText != null) {
    movieUrl = "http://www.omdbapi.com/?s=" + searchText + "&page=" + pageNumUrl + "&apikey=a0fb7e73"; // API URL if called from specific page number
    movieSearchText = searchText;
  }

  var request = new XMLHttpRequest();

  request.open('GET', movieUrl, true);

  request.onload = function () {

    movieContainer.innerHTML = '';

    if (request.status >= 200 && request.status < 400) { // Check if response code is between 200 and 400, i.e. success
      var data = JSON.parse(this.responseText);

      var movieDisplayRow = document.createElement('div');
      movieDisplayRow.setAttribute('class', 'movieDisplayRow'); // Create first row for displaying movie tiles

      data.Search.forEach((movie, index) => {

        // Create new row if number of movies in a row is 3
        if (index % 3 == 0 && index != 0) {
          movieContainer.appendChild(movieDisplayRow);
          movieDisplayRow = createNewRow();
        }

        // Create div component for movie poster
        const moviePoster = document.createElement('div');
        moviePoster.setAttribute('class', 'moviePoster');

        // Create div component for link to movie details page
        const movieLink = document.createElement('a');
        var movieLinkText = './index.html?imdbID=' + movie.imdbID;
        movieLink.setAttribute('href', movieLinkText);
        
        // Create image component for movie poster
        const movieImage = document.createElement('img');
        movieImage.setAttribute('class', 'movieImage');
        movieImage.src = movie.Poster;
        var imgAttribId = 'movieImg' + index;
        movieImage.setAttribute('id', imgAttribId);

        // Add poster component to row
        movieLink.appendChild(movieImage);
        moviePoster.appendChild(movieLink);
        movieDisplayRow.appendChild(moviePoster);

        createNewRow();

      })
        //--------------------------------------------------------Manual pagination
      // Add page numbers if count is greater than 10
      if (data.totalResults > 10) {
        const pageCount = data.totalResults / 10
        const pageNumDisp = document.createElement('div');
        for (i = 1; i <= pageCount; i++) {
          var singlePageNum = document.createElement('span');
          var singlePageLink = document.createElement('a');
          var spLinkText = './index.html?pagenum=' + i + '&searchText=' + movieSearchText;
          singlePageLink.setAttribute('href', spLinkText);
          singlePageLink.innerText = i + '   ';
          singlePageNum.appendChild(singlePageLink);
          pageNumDisp.appendChild(singlePageNum);
        }
        movieContainer.appendChild(pageNumDisp);
      }

    } else {
      const errorMessage = document.createElement('marquee')
      errorMessage.textContent = `Gah, it's not working!`
      app.appendChild(errorMessage)
    }
  }

  request.send()
}

// Function to create new div element for movie poster row
function createNewRow() {
  var movieDisplayRow = document.createElement('div')
  movieDisplayRow.setAttribute('class', 'movieDisplayRow')
  return movieDisplayRow;
}

//--------------------------------------------------------- To Do Partial loading when the user scrolls down
// Function to load more movie posters lazily
// function throttled(delay, fn) {
//   let lastCall = 0;
//   return function (...args) {
//     const now = (new Date).getTime();
//     if (now - lastCall < delay) {
//       return;
//     }
//     lastCall = now;
//     return fn(...args);
//   }
// }

// function lazyLoad() {
//   let lazyImages = [...document.querySelectorAll('.movieImage')]
//   lazyImages.forEach(image => {
//     if (image.offsetTop < window.innerHeight + window.pageYOffset){
//       image.src = image.dataset.src;
//     }
// })
// console.log(lazyImages)
// }

// window.addEventListener("scroll", throttled(50, lazyLoad))
//-------------------------------------------------------------------------------------

//-----------------------------------------------------Clicking on a movie displays additional information of the movie.
// Constructor for single movie detail property
function movieDetail(propName, propValue) {
  this.propertyName = propName;
  this.propertyValue = propValue;
}

//---------- Function to get movie details based on the id passed

function getMovieDetails(imdbID) {

  var movieUrl = "http://www.omdbapi.com/?i=" + imdbID + "&plot=full" + "&apikey=a0fb7e73"; // API URL to get full movie details
  var request = new XMLHttpRequest();

  request.open('GET', movieUrl, true);
  
  request.onload = function () {
    movieContainer.innerHTML = '';

    if (request.status >= 200 && request.status < 400) { // If success response obtained
      var data = JSON.parse(this.responseText);
      var movieDisplayRow = document.createElement('div');
      movieDisplayRow.setAttribute('class', 'movieDisplayRow');

      var movie = data;

      //Create div component for movie poster

      const moviePoster = document.createElement('div');
      moviePoster.setAttribute('class', 'moviePoster');

      // Create image component for movie poster
      const movieImage = document.createElement('img');
      movieImage.setAttribute('class', 'movieImage');
      movieImage.src = movie.Poster;

      // Create div component for movie details
      const movieDetails = document.createElement('div');
      movieDetails.setAttribute('class', 'moviePosterDetail');

      // Add all movie details in array
      var movieDetailsArray = [];
      movieDetailsArray.push(new movieDetail('movieTitle',movie.Title));
      movieDetailsArray.push(new movieDetail('movieYear',movie.Year));
      movieDetailsArray.push(new movieDetail('movieRated',movie.Rated));
      movieDetailsArray.push(new movieDetail('movieReleased',movie.Released));
      movieDetailsArray.push(new movieDetail('movieRuntime',movie.Runtime));
      movieDetailsArray.push(new movieDetail('movieGenre',movie.Genre));
      movieDetailsArray.push(new movieDetail('movieDirector',movie.Director));
      movieDetailsArray.push(new movieDetail('movieWriter',movie.Writer));
      movieDetailsArray.push(new movieDetail('movieActors',movie.Actors));
      movieDetailsArray.push(new movieDetail('moviePlot',movie.Plot));
      movieDetailsArray.push(new movieDetail('movieLanguage',movie.Language));
      movieDetailsArray.push(new movieDetail('movieCountry',movie.Country));
      movieDetailsArray.push(new movieDetail('movieAwards',movie.Awards));
      movieDetailsArray.push(new movieDetail('movieMetascore',movie.Metascore));
      movieDetailsArray.push(new movieDetail('movieimdbRating',movie.imdbRating));
      movieDetailsArray.push(new movieDetail('movieimdbVotes',movie.imdbVotes));
      movieDetailsArray.push(new movieDetail('movieimdbID',movie.imdbID));
      movieDetailsArray.push(new movieDetail('movieType',movie.Type));
      movieDetailsArray.push(new movieDetail('movieDVD',movie.DVD));
      movieDetailsArray.push(new movieDetail('movieBoxOffice',movie.BoxOffice));
      movieDetailsArray.push(new movieDetail('movieProduction',movie.Production));
      movieDetailsArray.push(new movieDetail('movieWebsite',movie.Website));

      // Create div components for each movie detail
      const movieAllDetails = MovieDetails(movieDetails, movieDetailsArray);

      // Add movie poster component to row
      moviePoster.appendChild(movieImage);
      movieDisplayRow.appendChild(moviePoster);

      // Add movie detail component to row
      movieDisplayRow.appendChild(movieAllDetails);
      
      createNewRow();
      movieContainer.appendChild(movieDisplayRow);
    } else {
      const errorMessage = document.createElement('marquee')
      errorMessage.textContent = `Gah, it's not working!`
      app.appendChild(errorMessage)
    }
  }

  request.send()
}

// Function to construct div component for individual movie detail
function MovieDetails(movieDetails, movieDetailsArray) {

  movieDetailsArray.forEach((movieDetail, index) => {
    const movieDetailComponent = document.createElement('div');
    movieDetailComponent.setAttribute('class', 'movieImage');
    movieDetailComponent.innerText = movieDetail.propertyName + ': ' + movieDetail.propertyValue;
    movieDetails.appendChild(movieDetailComponent);
  })   

  return movieDetails;
}

//---------------------------------
    