"use strict";
//search hide


       document.getElementById("searchappear").onclick = function() {
         let searchinput = document.getElementById("search");
     if (searchinput.style.display === "none") {
       searchinput.style.display = "block";
     } else {
       searchinput.style.display = "none";
     }


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

// Your web app's Firebase configuration
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

// append users to the DOM
function appendUsers(users) {
  let htmlTemplate = "";
  for (let user of users) {
    console.log(user.id);
    console.log(user.data().name);
    htmlTemplate += `
    <article>
      <h2>${user.data().name}</h2>
      <img src="${user.data().pic}">
      <h3>${user.data().alder}</h3>
      <h4>${user.data().køn}</h4>
      <p>${user.data().mail}</p>
      <button onclick="selectUser('${user.id}','${user.data().name}', '${user.data().mail}')">Update</button>
      <button onclick="deleteUser('${user.id}')">Delete</button>
    </article>
    `;
  }
  document.querySelector('#content').innerHTML = htmlTemplate;
}

// ========== CREATE ==========
// add a new user to firestore (database)
function createUser() {
  // references to the inoput fields
  let nameInput = document.querySelector('#name');
  let mailInput = document.querySelector('#mail');
  let kønInput = document.querySelector('#køn');
  let alderInput = document.querySelector('#alder');
  let picInput = document.querySelector('#pic');
  console.log(nameInput.value);
  console.log(mailInput.value);
  console.log(kønInput.value);
  console.log(alderInput.value);
  console.log(picInput.value);

  let newUser = {
    name: nameInput.value,
    mail: mailInput.value,
    køn: kønInput.value,
    alder: alderInput.value,
    pic: picInput.value,
  };

  userRef.add(newUser);
}


// ========== UPDATE ==========

function selectUser(id, name, mail) {
  // references to the input fields
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

// search functionality
function search(value) {
  let searchQuery = value.toLowerCase();
  let filteredUsers = [];
  for (let user of users) {
    let title = user.data().name.toLowerCase();
    if (title.includes(searchQuery)) {
      filteredUsers.push(user);
    }
  }
  console.log(filteredUsers);
  appendUsers(filteredUsers);
}
