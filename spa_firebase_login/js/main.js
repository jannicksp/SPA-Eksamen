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


                     }
              function myFunction(x) {
  x.classList.toggle("change");
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
const userRef = db.collection("Users");
let users =[];

// watch the database ref for changes
userRef.onSnapshot(function(snapshotData) {
users = snapshotData.docs;
  appendUsers(users);
});

// append users to the DOM Jannick
function appendUsers(users) {
  let htmlTemplate = "";
  for (let user of users) {
    console.log(user.id);
    console.log(user.data().movieName);
    htmlTemplate += `
    <article>
      <h2>${user.data().movieName}</h2>
      <img src="${user.data().movieImg}">
      <h3>${user.data().movieGenre}</h3>
      <h4>${user.data().moviePlot}</h4>
      <p>Your Rating:  ${user.data().yourRating} &#9733;</p>
      <p>IMDB Rating:  ${user.data().movieRating} &#9733;</p>
      <button onclick="deleteUser('${user.id}')">Delete</button>
    </article>
    `;
  }
  document.querySelector('#content').innerHTML = htmlTemplate;

}

// ========== CREATE ==========
// add a new user to firestore (database) Jannick
function createUser() {
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

  let newUser = {
    yourRating: yourRatingInput.value,
    movieName: movieNameInput.value,
    movieRating: movieRatingInput.value,
    moviePlot: moviePlotInput.value,
    movieGenre: movieGenreInput.value,
    movieImg: movieImgInput.value,
  };

  userRef.add(newUser);
  document.querySelector("#yourRating").value = "";
}


/* ========== UPDATE ==========

function selectUser(id, name, mail) {
  // references to the input fields Jannick
  let nameInput = document.querySelector('#name-update');
  let mailInput = document.querySelector('#mail-update');
  nameInput.value = name;
  mailInput.value = mail;
  selectedUserId = id;
}

function updateUser() {
  let nameInput = document.querySelector('#name-update');
  let mailInput = document.querySelector('#mail-update');

  let userToUpdate = {
    name: nameInput.value,
    mail: mailInput.value
  };
  userRef.doc(selectedUserId).set(userToUpdate);
}
unødig funktion*/
// ========== DELETE ==========
function deleteUser(id) {
  console.log(id);
  userRef.doc(id).delete();
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
    tabbar.classList.remove("hide");
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
  let filteredUsers = [];
  for (let user of users) {
    let title = user.data().movieName.toLowerCase();
    if (title.includes(searchQuery)) {
      filteredUsers.push(user);
    }
  }
  console.log(filteredUsers);
  appendUsers(filteredUsers);


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
      appendProducts(json.Search);
    });

}

function appendProducts(products) {
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
