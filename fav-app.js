// const favImage = document.querySelector(".product-img");
// const favDetails = document.querySelector(".fav-product-info");
// const addFavBtn = document.querySelector(".fav-bag-btn");
// const moreBtn = document.querySelector(".fav-remove");
// const favContainerDOM = document.querySelector(".fav-container");

// class Product {
//   async getFavProducts() {
//     try {
//       let results = await fetch("products.json");
//       let datas = await results.json();
//       let product = datas.items;
//       product = product.map((item) => {
//         const { title, price } = item.fields;
//         const { id } = item.sys;
//         const image = item.fields.image.fields.file.url;
//         return { title, price, id, image };
//       });
//       return product;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// let cart = [];
// let fav = [];
// let allProductsId = [];
// let buttonsDOM = [];

// ////////////////////////////////////////////////////////
// class UI {
//   displayFavProducts(products) {
//     let favProducts = "";
//     products.forEach((product) => {
//       favProducts += `
//                 <section class="favourite">

//         <h2 class="fav-heading">favourites</h2>
//         <div class="fav-container">
//             <div class="fav-products">
//                 <div class="fav-img-container">
//                     <img src=${product.image} alt="Product" class="product-img ">
//                 </div>
//                 <div class="fav-setting">
//                     <div class="fav-product-info">
//                             <h3>${product.title}</h3>
//                             <h4>$${product.price}</h4>
//                     </div>
//                     <div class="fav-btns">
//                         <button class="fav-bag-btn" data-id=${product.id}>
//                             <i class="fa fa-shopping-cart fa-lg">
//                             </i>
//                         </button>
//                         <button class="fav-remove" data-id=${product.id}>
//                             <i class="fa fa fa-bars fa-lg" aria-hidden="true">
//                             </i>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div class="no-fav hide-element">
//             <img src="./images/FavoriYok.svg" alt="" class="no-items">
//             <h4>There are no items in your wish list</h4>
//             <p>You haven't added any items to your wish list yet; all you have to do is <br> click on the little heart icon on the items.</p>
//             <button>start shopping</button>
//         </div>
//     </section>`;
//       allProductsId += product.id;
//     });
//     ProductsDOM.innerHTML = result;
//   }

//   getFavButtons() {
//     const buttons = [...document.querySelectorAll(".fav-btn")];
//     buttonsDOM = buttons;

//     buttons.forEach((button) => {
//       let id = button.dataset.id;
//       let inFav = fav.find((item) => item.id === id);
//       if (inFav) {
//         button.classList.add("fav-active");
//       }
//       button.addEventListener("click", (e) => {
//         e.target.classList.add("fav-active");
//         //get product from products
//         let favItem = { ...Storage.getProduct(id) };

//         //add the product to the cart
//         fav = [...fav, favItem];
//         //save the cart in local storage
//         Storage.saveCart(fav);
//         //display cart items
//         this.addFavItem(favItem);
//         //show the cart
//         // this.showCart();
//       });
//     });
//   }
// }
// ///////////////////////////////////////////////////////

// //local storage

// class Storage {}
// document.addEventListener("DOMContentLoaded", () => {
//   const ui = new UI();
//   const product = new Product();
//   //get all products
//   products.getFavProducts().then((data) => console.log(data));
// });
