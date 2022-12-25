// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBar73LMoBHFw_lTvcJB3o27dg4OVVswO8",
  authDomain: "login-515f8.firebaseapp.com",
  databaseURL: "https://login-515f8-default-rtdb.firebaseio.com",
  projectId: "login-515f8",
  storageBucket: "login-515f8.appspot.com",
  messagingSenderId: "708712478366",
  appId: "1:708712478366:web:41a3289788bdd4ae8c2d8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, set, child, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const db= getDatabase();

const name = document.getElementById("nameInp");
const email = document.getElementById("emailInp");
const username = document.getElementById("userInp");
const pass = document.getElementById("passInp");
const submit = document.getElementById("sub_btn");
let userlink = document.getElementById("userlink");
let signoutlink = document.getElementById("signoutlink");
var currentUser = null;


function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
}


//--------------------------------FUNCTIONS----------------------------------//
function getUserName(){
  let keepLoggedIn=localStorage.getItem("keepLoggedIn");

  if(keepLoggedIn=="yes"){
    currentUser = JSON.parse(localStorage.getItem('user'));

  }

  else{
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

function Signout(){
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('keepLoggedIn');
    window.location="index.html";
    window.location="services.html";
    window.location="cart.html";
    window.location="contact.html";

}


//---------------------------------WINDOWS LOADS-----------------------------//
window.onload=function(){
  getUserName();
  if(currentUser == null){
    userlink.innerText="Create New Account";
    userlink.style.color = "white";
    userlink.classList.replace("nav-link", "btn");
    userlink.classList.add("btn-primary");
    userlink.style.backgroundColor="#1B1B1B";
    userlink.style.borderColor="#1B1B1B";
    userlink.href="register.html";

    userlink.innerText="Login";
    userlink.style.color = "white";
    userlink.classList.replace("nav-link", "btn");
    userlink.classList.add("nav-link", "btn-success");
    userlink.href="login.html";

  }

  else{
    userlink.innerText= currentUser.username;
    userlink.style.color = "white";
    userlink.classList.replace("btn","nav-link" );
    userlink.classList.add("btn-primary");
    userlink.href="";

    signoutlink.innerText= "Sign Out";
    userlink.style.color = "white";
    signoutlink.classList.replace("btn","nav-link" );
    signoutlink.classList.add("btn-primary");
    signoutlink.href="javascrip:Signout()";
  }

}


//-------------------------------VALIDATION---------------------------------//

function Valitaditon(){
  if(isEmptyOrSpaces(name.value) || isEmptyOrSpaces(email.value) || isEmptyOrSpaces(username.value) || isEmptyOrSpaces(pass.value)){
    alert("Please do not left any field empty.");
    return false;
  }


  let nameregex = /^[a-zA-Z\s]+$/;
  let emailregex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;
  let userregex = /^[a-zA-Z0-9]{5,}$/;

  if(!nameregex.test(name.value)){
    alert("The name should only contains alphabets!");
    return false;
  }

  if(!emailregex.test(email.value)){
    alert("Please enter a valid email adress.");
    return false;
  }

  if(!userregex.test(username.value)){
    alert("-Username can only be alphanumeric\n Username must be at least 5 characters\n Username cannot contain spaces");
    return false;
  }
  return true;
}

function RegisterUser(){
  if(!Valitaditon()){
    return;
  };

  const dbRef = ref(db);

  get(child(dbRef, "UsersList/"+ username.value)).then((snapshot)=>{
    if(snapshot.exists()){
      alert("Account already exists");
    }
    else{
      set(ref(db, "UsersList/" + username.value),{
        fullname: name.value,
        email: email.value,
        username: username.value,
        password: encPass()
      })
      .then(()=>{
        alert("Registering completed succesfully. Welcome to TOPLA!");
      })
      .catch((error)=>{
        alert("error"+ error);
      })
    }
  });
}


//---------------------------------AUTHENTICATION PROCESS----------//

function AuthenticateUser(){
  const dbRef= ref(db);

  get(child(dbRef, "UsersList/"+ username.value)).then((snapshot)=>{
    if(snapshot.exists()){
      let dbpass = decPass(snapshot.val().password);
      if(dbpass == pass.value){
        login(snapshot.val());
      }
    else{
      alert("User does not exist");
    }
  }
  else{
    alert("Username or Password is Invalid")
  }
  });
}

//---------------------------LOGIN--------------------------//
function login(user){
  let keepLoggedIn = document.getElementById('customSwitch1').checked;

  if(!keepLoggedIn){
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location="index.html";
    window.location="services.html";
    window.location="cart.html";
    window.location="contact.html";
  }
  else{
    sessionStorage.setItem('keepLoggedIn', 'yes');
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location="index.html";
    window.location="services.html";
    window.location="cart.html";
    window.location="contact.html";
  }
}


//-------------------------DECRIPTION------------------------//
function decPass(dbpass){
  var pass12 = CryptoJS.AES.decrypt(dbpass, pass.value);
  return pass12.toString(CryptoJS.enc.Utf8);
}


//---------------------------------ENCRIPTION---------------------//
function encPass(){
  var pass12= CryptoJS.AES.encrypt(pass.value, pass.value);
  return pass12.toString();
}


//---------------------- ASSIGN ITEMS---------------------///
if(submit){
  submit.addEventListener('click', RegisterUser);
  submit.addEventListener('click', AuthenticateUser);
}
