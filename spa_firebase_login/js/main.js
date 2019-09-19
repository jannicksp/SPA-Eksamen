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
function compare(a, b) {
  if (a.data().movieName < b.data().movieName) {
    return -1;
  }
  if (a.data().movieName > b.data().movieName) {
    return 1;
  }
  return 0;
}

function sortMovies() {
  movies = movies.sort(compare)
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
// Initialize Firebase Jannick og Burhan
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const movieRef = db.collection("movies");
const userRef = db.collection("users");
let movies = [];
let currentUser;

// watch the database ref for changes
movieRef.onSnapshot(function(snapshotData) {
  movies = snapshotData.docs;
  appendMovies(movies);
});

// append movies to the DOM Jannick og Ian
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
// add a new movie to firestore (database) Jannick og Ian
function createMovie() {
  // references to the inoput fields
  let yourRatingInput = document.querySelector('#yourRating');
  let movieNameInput = document.querySelector('#movieName');
  let movieRatingInput = document.querySelector('#movieRating');
  let moviePlotInput = document.querySelector('#moviePlot');
  let movieGenreInput = document.querySelector('#movieGenre');
  let movieImgInput = document.querySelector('#movieImg');
  document.querySelector("#apiSearchResults").value = "";


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
// ========== DELETE med Alert Jannick==========
function deleteMovie(id) {
  let r= confirm("Er du sikker på at du vil slette filmen?");
  if (r == true) {
    console.log(id);
    movieRef.doc(id).delete();
  }
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

// Listen on authentication state change Burhan
firebase.auth().onAuthStateChanged(function(user) {
  let tabbar = document.querySelector('#tabbar');
  currentUser = user;
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

// append user data to profile page
function appendUserData() {
  // auth user
  document.querySelector('#name').value = currentUser.displayName;
  document.querySelector('#mail').value = currentUser.email;

  // database user Burhan
  userRef.doc(currentUser.uid).get().then(function(doc) {
    let userData = doc.data();
    console.log(userData);
    if (userData) {
      document.querySelector('#birthdate').value = userData.birthdate;
      document.querySelector('#imagePreview').src = userData.img;
    }
  });
}

// update user data - auth user and database object
function updateUser() {
  let user = firebase.auth().currentUser;

  // update auth user
  user.updateProfile({
    displayName: document.querySelector('#name').value
  });

  // update database user
  userRef.doc(currentUser.uid).set({
    img: document.querySelector('#imagePreview').src,
    birthdate: document.querySelector('#birthdate').value
  }, {
    merge: true
  });
}

// ========== Prieview image function ========== //
function previewImage(file, previewId) {
  if (file) {
    let reader = new FileReader();
    reader.onload = function(event) {
      document.querySelector('#' + previewId).setAttribute('src', event.target.result);
    };
    reader.readAsDataURL(file);
  }
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


/* Searchfunction to search in the OMDB api and show movieresults - Ian */

// Function to search throught the API
function apisearch(value) {

// Here it takes the OMDB api site and puts the value from the searchfield at the end, so it finds the right movie.
  let url = "http://www.omdbapi.com/?apikey=196312ed&s=" + value;
  console.log(url);
  console.log(value);
  console.log(value.length);

// If the length of the searchfield is 0, it clears the movie array
  if (value.length == 0) {
    document.querySelector("#grid-products").innerHTML = "";
  }

// Here it fetches movies from the beforegiven url
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json.Search);
      appendMovieList(json.Search);
    });

}
 /* Appends movies to the HTML with id "grid-products" - Fetches it from the api with a backtick string - Ian */
 // Furthermore it utilizes a "for loop", to run through the array and append all the different objects
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

// This is to hide the searched movies, once you have clicked the one you were looking for
// This gets
function hideMovieSearch() {
  document.querySelector("#grid-products").innerHTML = "";

}


// As before, it fetches from the api by taking the value from apisearch2(search.this) in the html.
function apisearch2(value) {
  console.log(value);

  let url = "http://www.omdbapi.com/?apikey=196312ed&t=" + value;
  console.log(url);

// Fetching from the url above, wainting for a response and then calls the funcion "appendMovieInfo"
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);
      appendMovieInfo(json);
    });
}

// Again sets the values of the html fields to api results
function appendMovieInfo(MovieInfo) {
  document.querySelector("#movieName").value = `${MovieInfo.Title} (${MovieInfo.Year})`;
  document.querySelector("#movieRating").value = `${MovieInfo.imdbRating}`;
  document.querySelector("#moviePlot").value = `${MovieInfo.Plot}`;
  document.querySelector("#movieGenre").value = `${MovieInfo.Genre}`;
  document.querySelector("#movieImg").value = `${MovieInfo.Poster}`;

}

/* Feed and firestore database for feed - ian */
const movieFeedRef = db.collection("movieFeedStorage");
let moviesFeed = [];

// watch the database ref for changes
movieFeedRef.onSnapshot(function(snapshotData) {
  moviesFeed = snapshotData.docs;
  appendMoviesFeed(moviesFeed);
});

// This function takes data from Firebases Realtime Database and loops through and append them all to the DOM.
function appendMoviesFeed(moviesFeed) {
  let htmlTemplate = "";
  for (let movieFeed of moviesFeed) {
    console.log(movieFeed);
    htmlTemplate += `
    <p id="haveWatched">${movieFeed.data().personName} has recently watched:</p>
      <article id="movieFeedBox">
        <img id="feedleft" src='${movieFeed.data().movieImg}'>
        <h3 id="feedTitle" class="feedright">${movieFeed.data().movieName}</h3>
        <p class="feedright"> ${movieFeed.data().personName}'s Rating:  ${movieFeed.data().yourRating} &#9733;</p>
        <p class="feedright"> IMDB Rating:  ${movieFeed.data().movieRating} &#9733;</p>
      </article>
    `;

  }
  document.querySelector('#feedContent').innerHTML = htmlTemplate;
}

function createMovieFeed() {
  // get the values from the input fields
  // Extra note: "${currentUser.displayName}" refers to the name of the person currently logged in.
  let personName = `${currentUser.displayName}`;
  let yourRating = document.querySelector('#yourRating').value;
  let movieName = document.querySelector('#movieName').value;
  let movieRating = document.querySelector('#movieRating').value;
  let movieImg = document.querySelector('#movieImg').value;


  // create a new object with the values of above ^
  let newmoviefeed = {
    personName: personName,
    movieName: movieName,
    yourRating: yourRating,
    movieRating: movieRating,
    movieImg: movieImg
  };

  // Add the new object to the array
  movieFeedRef.add(newmoviefeed);
  // To reset the "yourRating" input field
  document.querySelector("#yourRating").value = "";
}
