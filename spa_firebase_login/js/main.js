"use strict";
//search hide Jannick


       document.getElementById("searchappear").onclick = function() {
         let searchinput = document.getElementById("search");
     if (searchinput.style.display === "none") {
       searchinput.style.display = "block";
     } else {
       searchinput.style.display = "none";
     }

//add movie Jannick

              }

              document.getElementById("newappear").onclick = function() {
                let addinput = document.getElementById("addMovieBox");
            if (addinput.style.display === "none") {
              addinput.style.display = "block";
            } else {
              addinput.style.display = "none";
            }

// burgermenu med animation jannick
                     }
              function myBurger(x) {
  x.classList.toggle("change");
}
// sort function Jannick
function compare( a, b ) {
  if ( a.data().movieName < b.data().movieName ){
    return -1;
  }
  if ( a.data().movieName > b.data().movieName ){
    return 1;
  }
  return 0;
}
function sortMovies() {
  movies=movies.sort(compare)
console.log(movies);
  appendMovies(movies.sort(compare));
}

// hide all pages
function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
}

// show page or tab
function showPage(pageId) {
  hideAllPages();
  document.querySelector(`#${pageId}`).style.display = "block";
  location.href = `#${pageId}`;
  setActiveTab(pageId);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
  let pages = document.querySelectorAll(".tabbar a");
  for (let page of pages) {
    if (`#${pageId}` === page.getAttribute("href")) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }

  }
}

// set default page
function setDefaultPage() {
  let page = "home";
  if (location.hash) {
    page = location.hash.slice(1);
  }
  showPage(page);
}


function showLoader(show) {
  let loader = document.querySelector('#loader');
  if (show) {
    loader.classList.remove("hide");
  } else {
    loader.classList.add("hide");
  }
}

// ========== Firebase sign in functionality ========== //

// Your web app's Firebase configuration Jannick
const firebaseConfig = {
  apiKey: "AIzaSyDm7ySbgFhwYhs_n__ZfIsRmlJpIsn5TFk",
  authDomain: "spa-webapp.firebaseapp.com",
  databaseURL: "https://spa-webapp.firebaseio.com",
  projectId: "spa-webapp",
  storageBucket: "spa-webapp.appspot.com",
  messagingSenderId: "989289290205",
  appId: "1:989289290205:web:9c6ab89d96734a81d2be34"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const movieRef = db.collection("movies");
let movies =[];

// watch the database ref for changes
movieRef.onSnapshot(function(snapshotData) {
movies = snapshotData.docs;
  appendMovies(movies);
});

// append movies to the DOM Jannick
function appendMovies(movies) {
  let htmlTemplate = "";
  for (let movie of movies) {
    console.log(movie.id);
    console.log(movie.data().movieName);
    htmlTemplate += `
    <article>
      <h2>${movie.data().movieName}</h2>
      <img src="${movie.data().movieImg}">
      <h3>${movie.data().movieGenre}</h3>
      <h4>${movie.data().moviePlot}</h4>
      <p>Your Rating:  ${movie.data().yourRating} &#9733;</p>
      <p>IMDB Rating:  ${movie.data().movieRating} &#9733;</p>
      <button onclick="deleteMovie('${movie.id}')">Delete</button>
    </article>
    `;
  }
  document.querySelector('#content').innerHTML = htmlTemplate;
}

// ========== CREATE ==========
// add a new movie to firestore (database) Jannick
function createMovie() {
  // references to the inoput fields
  let yourRatingInput = document.querySelector('#yourRating');
  let movieNameInput = document.querySelector('#movieName');
  let movieRatingInput = document.querySelector('#movieRating');
  let moviePlotInput = document.querySelector('#moviePlot');
  let movieGenreInput = document.querySelector('#movieGenre');
  let movieImgInput = document.querySelector('#movieImg');
  document.querySelector("#apiSearchResults").value = "";

/*
  let nameInput = document.querySelector('#name');
  let mailInput = document.querySelector('#mail');
  let kønInput = document.querySelector('#køn');
  let alderInput = document.querySelector('#alder');
  let picInput = document.querySelector('#pic');
  */

  let newMovie = {
    yourRating: yourRatingInput.value,
    movieName: movieNameInput.value,
    movieRating: movieRatingInput.value,
    moviePlot: moviePlotInput.value,
    movieGenre: movieGenreInput.value,
    movieImg: movieImgInput.value,
  };

  movieRef.add(newMovie);

}


/* ========== UPDATE ==========

function selectMovie(id, name, mail) {
  // references to the input fields Jannick
  let nameInput = document.querySelector('#name-update');
  let mailInput = document.querySelector('#mail-update');
  nameInput.value = name;
  mailInput.value = mail;
  selectedMovieId = id;
}

function updateMovie() {
  let nameInput = document.querySelector('#name-update');
  let mailInput = document.querySelector('#mail-update');

  let MovieToUpdate = {
    name: nameInput.value,
    mail: mailInput.value
  };
  movieRef.doc(selectedMovieId).set(movieToUpdate);
}
unødig funktion*/
// ========== DELETE ==========
function deleteMovie(id) {
  console.log(id);
  movieRef.doc(id).delete();
}



// Firebase UI configuration
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '#home',
};

// Init Firebase UI Authentication
const ui = new firebaseui.auth.AuthUI(firebase.auth());

// Listen on authentication state change
firebase.auth().onAuthStateChanged(function(user) {
  let tabbar = document.querySelector('#tabbar');
  console.log(user);
  if (user) { // if user exists and is authenticated
    setDefaultPage();
    tabbar.classList.remove("hide");+
    appendUserData(user);
  } else { // if user is not logged in
    showPage("login");
    tabbar.classList.add("hide");
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  showLoader(false);
});

// sign out user
function logout() {
  firebase.auth().signOut();
}

function appendUserData(user) {
  document.querySelector('#profile').innerHTML += `
    <h3>${user.displayName}</h3>
    <p>${user.email}</p>
  `;
}

// search functionality Jannick
function search(value) {
  let searchQuery = value.toLowerCase();
  let filteredMovies = [];
  for (let movie of movies) {
    let title = movie.data().movieName.toLowerCase();
    if (title.includes(searchQuery)) {
      filteredMovies.push(movie);
    }
  }
  console.log(filteredMovies);
  appendMovies(filteredMovies);
}


/* Searchfunction to search in the OMDB api and show movieresults */

function apisearch(value) {


  let url = "http://www.omdbapi.com/?apikey=196312ed&s=" + value;
  console.log(url);
console.log(value);
console.log(value.length);

if (value.length == 0) {
  document.querySelector("#grid-products").innerHTML = "";
}

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json.Search);
      appendMovieList(json.Search);
    });

}

function appendMovieList(products) {
  let htmlTemplate = "";
  for (let product of products) {
    console.log(product);
    htmlTemplate += `
    <section class = "grid-item">
    <a onclick="hideMovieSearch(), apisearch2('${product.Title}')">
      <h3>${product.Title} (${product.Year})</h3>
      <img src="${product.Poster}">
      </a>
    </section>
    `;

  }
  document.querySelector("#grid-products").innerHTML = htmlTemplate;
}

function hideMovieSearch() {
    document.querySelector("#grid-products").innerHTML = "";

}

function apisearch2(value) {
  console.log(value);

  let url = "http://www.omdbapi.com/?apikey=196312ed&t=" + value;
  console.log(url);

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);
      appendMovieInfo(json);
    });
}

function appendMovieInfo(MovieInfo) {
document.querySelector("#movieName").value = `${MovieInfo.Title} (${MovieInfo.Year})`;
document.querySelector("#movieRating").value = `${MovieInfo.imdbRating}`;
document.querySelector("#moviePlot").value = `${MovieInfo.Plot}`;
document.querySelector("#movieGenre").value = `${MovieInfo.Genre}`;
document.querySelector("#movieImg").value = `${MovieInfo.Poster}`;

}

/* Feed */

let moviesFeed = [];

console.log(moviesFeed);

function appendMoviesFeed(moviesFeed) {
  for (let movieFeed of moviesFeed) {
    console.log(movieFeed);
    document.querySelector("#grid-teachers").innerHTML += `
      <article id="movieFeedBox">
        <img id="left" src='${movieFeed.movieImg}'>
        <h3 class="right">${movieFeed.movieName}</h3>
        <p class="right"> Your Rating:  ${movieFeed.yourRating} &#9733;</p>
        <p class="right">IMDB Rating:  ${movieFeed.movieRating} &#9733;</p>
      </article>
    `;

  }
}

appendMoviesFeed(moviesFeed);

function createMovieFeed() {
  // get the values from the input fields
  let yourRating = document.querySelector('#yourRating').value;
  let movieName = document.querySelector('#movieName').value;
  let movieRating = document.querySelector('#movieRating').value;
  let movieImg = document.querySelector('#movieImg').value;

  // create a new object
  let newmoviefeed = {
    movieName: movieName,
    yourRating: yourRating,
    movieRating: movieRating,
    movieImg: movieImg
  };

  // push the new object to the array
  moviesFeed.push(newmoviefeed);

  // reset grid
  document.querySelector("#grid-teachers").innerHTML = "";
  // call appendTeachers to append all teachers again
  appendMoviesFeed(moviesFeed);
  // To reset the "yourRating" input field
  document.querySelector("#yourRating").value = "";
}
