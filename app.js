const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const ProductsDOM = document.querySelector(".products-center");
const copyRight = document.querySelector(".copyright");

const optionBtn = document.querySelector(".option-btn");
const closeOptionBtn = document.querySelector(".close-option");
const optionDOM = document.querySelector(".option");
const optionOverlay = document.querySelector(".option-overlay");
const optionContent = document.querySelector(".option-content");

const locationBtn = document.querySelector(".location");
const closeLocationBtn = document.querySelector(".close-location");
const locationSmallBtn = document.querySelector(".location-sm");
const locationConfirm = document.querySelector(".location-confirm");
const locationDOM = document.querySelector(".location-popup");
const locationOverlay = document.querySelector(".location-overlay");

const favImage = document.querySelector(".product-img");
const favDetails = document.querySelector(".fav-product-info");
const addFavBtn = document.querySelector(".fav-bag-btn");
const moreBtn = document.querySelector(".fav-remove");
const favContainerDOM = document.querySelector(".fav-container");

let cart = [];
let fav = [];
let allProductsId = [];

//buttons
let buttonsDOM = [];
let favButtonsDOM = [];
let removeButtonsDOM = [];

//Getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getFavProducts() {
    try {
      let result = localStorage.getItem("favProducts");
      let products = JSON.parse(result);
      products = products.map((item) => {
        const title = item.title;
        const price = item.price;
        const id = item.id;
        const image = item.image;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
//Displaying the Products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
            <article class="product">
                <div class="img-container">
                        <img src=./images/product-2.jpeg alt="Product" class="product-img product-img-1 face">
                        <img src=${product.image} alt="Product" class="product-img product-img-2 face">
                </div>
                <div class= "star-rating" data-id=${product.id}>
                  <button class= "star fa-regular fa-star"></button>
                  <button class= "star fa-regular fa-star"></button>
                  <button class= "star fa-regular fa-star"></button>
                  <button class= "star fa-regular fa-star"></button>
                  <button class= "star fa-regular fa-star"></button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
                <button class="bag-btn fa fa-shopping-cart" data-id=${product.id}>
                      Add To Cart
                </button>
                <button class= "fav-btn fa fa-heart fa-lg" data-id=${product.id}>
                </button>
            </article>
            `;
      allProductsId += product.id;
    });
    ProductsDOM.innerHTML = result;
  }

  displayFavProducts(products) {
    let favProducts = "";
    products.forEach((product) => {
      favProducts += `
            <div class="fav-products">
                <div class="fav-img-container">
                    <img src=${product.image} alt="Product" class="product-img ">
                </div>
                <div class="fav-setting">
                    <div class="fav-product-info">
                            <h3>${product.title}</h3>
                            <h4>$${product.price}</h4>
                    </div>
                    <div class="fav-btns">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fa fa-shopping-cart fa-lg">
                            </i>
                        </button>
                        <button class="fav-remove fa fa-trash fa-lg" data-id=${product.id}>
                        </button>
                    </div>
                </div>
            </div>`;
      allProductsId += product.id;
    });
    favContainerDOM.innerHTML = favProducts;
  }

  getFavButtons() {
    const favButtons = [...document.querySelectorAll(".fav-btn")];
    favButtonsDOM = favButtons;
    favButtons.forEach((button) => {
      let id = button.dataset.id;
      let inFav = fav.find((item) => item.id === id);
      if (inFav) {
        button.classList.add("fav-active");
      }
      button.addEventListener("click", (e) => {
        if (e.target.classList.contains("fav-active")) {
          e.target.classList.remove("fav-active");
          this.removeFavourite(id);
        } else {
          e.target.classList.add("fav-active");
          //get product from products
          let favItem = { ...Storage.getProduct(id) };
          //add the product to the fav
          fav = [...fav, favItem];
          //save the fav in local storage
          Storage.saveFav(fav);
        }
      });
    });
  }

  getRemoveButtons() {
    const removefavButtons = [...document.querySelectorAll(".fav-remove")];
    removeButtonsDOM = removefavButtons;
    removefavButtons.forEach((button) => {
      let id = button.dataset.id;
      button.addEventListener("click", (e) => {
        this.removeFavourite(id);
        let removeFavItem = e.target;
        favContainerDOM.removeChild(
          removeFavItem.parentElement.parentElement.parentElement
        );
      });
    });
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.disabled = true;
        button.innerText = "IN CART";
      }
      button.addEventListener("click", (e) => {
        e.target.disabled = true;
        e.target.innerText = "IN CART";

        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add the product to the cart
        cart = [...cart, cartItem];
        //save the cart in local storage
        Storage.saveCart(cart);
        //set cart values
        this.setCartValues(cart);
        //display cart items
        this.addCartItem(cartItem);
        //show the cart
        // this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>Remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>

                    </div>`;

    cartContent.appendChild(div);
  }

  showLocation() {
    locationOverlay.classList.add("transparentBcg");
    locationDOM.classList.add("showLocation");
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  showOption() {
    optionOverlay.classList.add("transparentBcg");
    optionDOM.classList.add("showOption");
  }

  setupAPP() {
    cart = Storage.getCart();
    fav = Storage.getFav();
    this.setCartValues(cart);
    this.populate(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);

    optionBtn.addEventListener("click", this.showOption);
    closeOptionBtn.addEventListener("click", this.hideOption);

    locationBtn.addEventListener("click", this.showLocation);
    locationSmallBtn.addEventListener("click", this.showLocation);
    closeLocationBtn.addEventListener("click", this.hideLocation);
    locationConfirm.addEventListener("click", this.hideLocation);

    close;
  }

  populate(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  hideOption() {
    optionOverlay.classList.remove("transparentBcg");
    optionDOM.classList.remove("showOption");
  }

  hideLocation() {
    locationOverlay.classList.remove("transparentBcg");
    locationDOM.classList.remove("showLocation");
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();

      //this way is points to the class "cart" if you do clearCartBtn.addEventListener('click',clearCart) it will only points to the button
    });

    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);

        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount++;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount--;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `Add to Cart`;
  }
  removeFavourite(id) {
    fav = fav.filter((item) => item.id !== id);
    Storage.saveFav(fav);
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

// Local Storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static saveFav(fav) {
    localStorage.setItem("favProducts", JSON.stringify(fav));
  }

  static getFav() {
    return localStorage.getItem("favProducts")
      ? JSON.parse(localStorage.getItem("favProducts"))
      : [];
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //setup application
  ui.setupAPP();

  //   get all the products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
      ui.getFavButtons();
    });
  products
    .getFavProducts()
    .then((favProduct) => {
      ui.displayFavProducts(favProduct);
      Storage.saveFav(favProduct);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
      ui.getRemoveButtons();
    });
});

(function getDate() {
  let date = new Date();
  copyRight.innerHTML = `<p>© ${date.getFullYear()}  blah blah Ltd. All rights reserved. </p> `;
})();
