// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgCAHClsG8LU9y42mFLLo9UreOeCDd7kA",
  authDomain: "website-6d468.firebaseapp.com",
  databaseURL: "https://website-6d468-default-rtdb.firebaseio.com",
  projectId: "website-6d468",
  storageBucket: "website-6d468.appspot.com",
  messagingSenderId: "669352527933",
  appId: "1:669352527933:web:1dfb085633c7e248770254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//----------------------------FIREBASE STORAGE-----------------------//
import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL}
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";


//----------------------------FIREBASE DATABASE---------------------//
import {getDatabase, ref, set, child, get}
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

    const realdb = getDatabase();



//---------------------------REFERENCES-------------------------//
var Files = [];
var FileReaders = [];
var ImageLinksArray = [];

const imgdiv = document.getElementById('imagesDiv');
const selBtn = document.getElementById('selimgsbtn');
const addBtn = document.getElementById('addprodbtn');
const proglab = document.getElementById('loadlab');

const name = document.getElementById('nameinp');
const category = document.getElementById('catinp');
const description = document.getElementById('desarea');
const price = document.getElementById('priceinp');
const stock = document.getElementById('stockinp');

const p1 = document.getElementById('p1inp');
const p2 = document.getElementById('p2inp');
const p3 = document.getElementById('p3inp');
const p4 = document.getElementById('p4inp');


function OpenFileDialog(){
    let inp = document.createElement('input');
    inp.type='file';
    inp.multiple='multiple';
    inp.onchange = (e) => {
        AssignImgsToFilesArray(e.target.files);
        CreateImgTags();
    }
    inp.click();
}

function AssignImgsToFilesArray(thefiles){
    let num = Files.length + thefiles.length;
    let looplim = (num<=10) ? thefiles.length : (10-Files.length);

    for (let i = 0; i<looplim; i++){
        Files.push(thefiles[i]);
    }

    if(num>10) alert("max 10 imgs");
}

function  CreateImgTags(){
    imgdiv.innerHTML='';
    imgdiv.classList.add('imagesDivStyle');

    for (let i = 0; i < Files.length; i++){
        FileReaders[i] = new FileReader();

        FileReaders[i].onload = function(){
            var img = document.createElement('img');
            img.id = 'imgNo' + i;
            img.classList.add('imgs');
            img.src=FileReaders[i].result;
            imgdiv.append(img);
        }
        FileReaders[i].readAsDataURL(Files[i]);
    }
    let lab = document.getElementById('label');
    lab.innerHTML = 'clear images';
    lab.style='cursor:pointer; display:block; color:navy; font-size:12px';
    lab.addEventListener('click', ClearImages);
    imgdiv.append(lab);
}

function ClearImages(){
    Files=[];
    ImageLinksArray=[];
    imgdiv.innerHTML='';
    imgdiv.classList.remove('imagesDivStyle');
}

function getShortTitle(){
    let namey = name.value.substring(0,50);
    return namey.replace(/[^a-zA-Z0-9]/g, "");
}

function GetImgUploadProgress(){
    return 'Images Uploaded' + ImageLinksArray.length + 'of' + Files.length;
}

function IsAllImagesUploaded(){
    return ImageLinksArray.length == Files.length;
}

function GetPoints(){
    let points = [];

    if(p1.value.length>0) points.push(p1.value);
    if(p2.value.length>0) points.push(p2.value);
    if(p3.value.length>0) points.push(p3.value);
    if(p4.value.length>0) points.push(p4.value);

    return points;
};

function RestoreBack(){
    selBtn.disabled = false;
    addBtn.disabled = false;
}

function UploadAllImages(){
    selBtn.disabled = true;
    addBtn.disabled = true;

    ImageLinksArray=[];

    for (let i = 0; i<Files.length; i++){
        UploadAnImage(Files[i], i);
    }
};


function UploadAnImage(imgToUpload, imgNo){
    const metadata ={
        contentType : imgToUpload.type
    };

    const storage = getStorage();

    const ImageAddress = "TheImages/" + getShortTitle() +"/img#"+imgNo;

    const storageRef = sRef(storage, ImageAddress);

    const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metadata);

    UploadTask.on('state_changed', (snapshot) =>{
        proglab.innerHTML = GetImgUploadProgress();

},

    (error)=>{
        alert('image upload failed');
    },

    ()=>{
        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
            ImageLinksArray.push(downloadURL);

            if(IsAllImagesUploaded()){
                proglab.innerHTML="all images uploaded";
                UploadAProduct();
            }
        });
    }
    );
}

    function UploadAProduct(){
        set(ref(realdb, category.value + "/" + getShortTitle()),{
            ProductTitle: name.value,
            Category: category.value,
            Description: description.value,
            Price: price.value,
            Stock: stock.value,
            Points: GetPoints(),
            LinksOfImagesArray: ImageLinksArray
        });

        alert("upload successfully");
        RestoreBack();
    }


selBtn.addEventListener('click', OpenFileDialog);
addBtn.addEventListener('click', UploadAllImages);

