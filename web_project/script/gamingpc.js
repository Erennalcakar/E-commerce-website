import { } from './admin.js';

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


//----------------------------FIREBASE DATABASE---------------------//
import {getDatabase, ref, set, child, get}
    from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

    const realdb = getDatabase();

    var OuterDiv=document.getElementById('productsDiv');
    var ArrayOfProducts = [];
    window.addEventListener('load', GetAllProducts);
    

    function GetAllProducts(){
        const dbref = ref(realdb);

        get(child(dbref, "Gaming PC's"))
        .then((snapshot) =>{
            snapshot.forEach(prod => {
                ArrayOfProducts.push(prod.val());
            });
            AddAllProducts();
        })
    }

    function AddAllProducts(){
        let i = 0;
        ArrayOfProducts.forEach(prod =>{
            AddAProduct(prod, i++);
        });
    }

    function AddAProduct(product, index){
        let html =
        `
        <img src="`+ product.LinksOfImagesArray[0] +`" class="thumb mt-2" id="thumb` + index + `" >
                <p class="title" id="title ` + index + `"> ` + product.ProductTitle +`</p>
                `+
                GetUl(product.Points)
                +
                GenerateStockLabel(product.Stock)
                +
                `
                <h5 class="price">$ `+ product.Price +` </h5>
                <button class="detbtns btn" id="detbtn">View Details</button>
        `
        let newProd = document.createElement('div');
        newProd.classList.add('productcard');
        newProd.innerHTML = html;
        OuterDiv.append(newProd);
    }

    function GenerateStockLabel(stock){
        let stocklabel= document.createElement('h5');
        stocklabel.classList.add('stock');

        if (stock>0){
            stocklabel.innerHTML="IN STOCK";
            stocklabel.classList.add('text-success');
        }

        else{
            stocklabel.innerHTML="OUT OF STOCK";
            stocklabel.classList.add('text-warning');
        }
      return stocklabel.outerHTML;
    }

    function GetUl(array){
        let ul = document.createElement('ul');
        ul.style="list-style-type:none"
        ul.classList.add('points');

        array.forEach(element =>{
            let li = document.createElement('li');
            li.innerText=element;
            ul.append(li);
        });
        return ul.outerHTML;
    }
