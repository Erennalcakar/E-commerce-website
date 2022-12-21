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


function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
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
  let keepLoggedIn = document.getElementById('customSwitch1')
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
submit.addEventListener('click', RegisterUser);