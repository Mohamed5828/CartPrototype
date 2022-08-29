const cartBtn = document.querySelector('.cart-btn')
const closeCartBtn = document.querySelector('.close-cart')
const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartOverlay = document.querySelector('.cart-overlay')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const  ProductsDOM = document.querySelector('.products-center')


const optionBtn = document.querySelector('.option-btn')
const closeOptionBtn = document.querySelector('.close-option')
const optionDOM = document.querySelector('.option')
const optionOverlay = document.querySelector('.option-overlay')
const optionContent = document.querySelector('.option-content')


let cart = [];
let allProductsId =[];
//buttons
let buttonsDOM= [];

//Getting the products
class Products{
async getProducts(){
    try{
        let result = await fetch('products.json')
        let data = await result.json();
        let products = data.items;
        products = products.map(item=>{
            const {title,price} = item.fields;
            const {id} = item.sys
            const image = item.fields.image.fields.file.url;

            return{title,price,id,image}
        })
        return products
    }catch(error){
        console.log(error);
    }
}
}

//Displaying the Products
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product =>{
            result += `
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="Product" class ="product-img">
                </div>
                <i class="fas fa-star"></i> 
                <i class="fas fa-star"></i> 
                <i class="fas fa-star"></i> 
                <i class="fas fa-star"></i> 
                <i class="fas fa-star"></i> 
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
                <button class="bag-btn" data-id=${product.id}>
                        <i class="fa fa-shopping-cart">
                             Add To Cart
                        </i>
                </button>
            </article>
            `;
        allProductsId += product.id;
        });
        ProductsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;

        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.disabled = true
                button.innerText= "IN CART";
                
            }
                button.addEventListener('click', (e) =>{
                    e.target.disabled = true
                    e.target.innerText = "IN CART"
                    

                    //get product from products
                    let cartItem = {...Storage.getProduct(id) , amount:1};
                    

                    //add the product to the cart
                    cart = [...cart , cartItem]
                    //save the cart in local storage
                    Storage.saveCart(cart)
                    //set cart values
                    this.setCartValues(cart);
                    //display cart items
                    this.addCartItem(cartItem)
                    //show the cart
                    // this.showCart();
                })
        });
    }
    setCartValues(cart){
        let tempTotal = 0
        let itemsTotal = 0

        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
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

    showCart(){
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }

    showOption(){
        optionOverlay.classList.add('transparentBcg')
        optionDOM.classList.add('showOption')
    }

    setupAPP(){
        cart = Storage.getCart();   
        this.setCartValues(cart);
        this.populate(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart)


        optionBtn.addEventListener('click',this.showOption);
        closeOptionBtn.addEventListener('click', this.hideOption)

        close
    }

    populate(cart){
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart(){
        cartOverlay.classList.remove('transparentBcg')
        cartDOM.classList.remove('showCart')
    }

    hideOption(){
        optionOverlay.classList.remove('transparentBcg')
        optionDOM.classList.remove('showOption')
    }


    cartLogic(){
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart()

            //this way is points to the class "cart" if you do clearCartBtn.addEventListener('click',clearCart) it will only points to the button
        })

        cartContent.addEventListener('click',event =>{
            if (event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id =removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement)
                
                this.removeItem(id);
            }else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount= event.target
                let id =addAmount.dataset.id
                let tempItem = cart.find(item =>item.id === id);
                tempItem.amount ++;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;

            }else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target
                let id = lowerAmount.dataset.id
                let tempItem = cart.find(item =>item.id === id);
                tempItem.amount --
                if (tempItem > 0){
                    Storage.saveCart(cart)
                    this.setCartValues(cart)
                    lowerAmount.previousElementSibling.innerText =tempItem.amount;
                }else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id)
                }
            }
        })
    }

    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        while(cartContent.children.length > 0 ){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }

    removeItem(id){
        cart = cart.filter(item => item.id !== id)
        this.setCartValues(cart);
        Storage.saveCart(cart)
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Cart`
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id)
    }
    // SliderItems(id){
    //     let sliderImages = Array.from(document.querySelectorAll(`.product-img-${id}`));
    //     let slidesCounter = sliderImages.length;
    //     let currentSlide = 1;
    //     let paginationElement = document.createElement('ul');
    //     globalThis.currentSlide
    //     paginationElement.setAttribute('id', 'pagination-ul');
    //     //creat li based on slides length
    //     for (let i =1 ; i <= slidesCounter ; i++){
    //         //create the li
    //     let paginationItem = document.createElement('li');
    //         paginationItem.setAttribute(`data-index-${id}`, i);
    //         paginationItem.classList.add(`data-index-${id}`)
    //         paginationItem.appendChild(document.createTextNode(i));

    //         //append item to the main ul list

    //         paginationElement.appendChild(paginationItem)

    //     }

    //     //add the created ul element to the page
    //     document.querySelector(`#indicators-${id}`).appendChild(paginationElement);
    //     let paginationCreatedUl = document.getElementById('pagination-ul')

    //     //get pagination element
    //     let paginationBullets = Array.from(document.querySelectorAll('#pagination-ul li'));

    //     //loop through all bullets
    //     for(let i =0 ; i<paginationBullets.length ; i++){
    //         paginationBullets[i].onclick = function (){
    //             currentSlide = parseInt(this.getAttribute(`data-index-${id}`))
    //             theChecker(id);
    //     }
    // }
    //     theChecker(id);

    //     //testing
    //      // Create The Checker Function
    // function theChecker(id) {
    // // Remove All Active Classes
    // removeAllActive(id);

    // // Set Active Class On Current Slide
    // sliderImages[currentSlide - 1].classList.add('active');

    // // Set Active Class on Current Pagination Item
    // paginationCreatedUl.children[currentSlide - 1].classList.add('active');

    // }
    // function removeAllActive(id){
    //     sliderImages.forEach((img)=>{
    //         if(img.classList.contains(`data-index-${id}`)){
    //         img.classList.remove('active');
    //         }
    //     });
    //     paginationBullets.forEach((bullet)=>{
    //         if(bullet.classList.contains(`data-index-${id}`))
    //         {
    //         bullet.classList.remove('active');
    //         }
    //     });
    // }


    // }  

    // ---------------replace this ---------//
            //  <div class="img-container">
            //         <div class="slider-container">
            //             <img src=${product.image} alt="Product" class="product-img product-img-${product.id}">
            //             <img src=${product.image} alt="Product" class="product-img product-img-${product.id}">
            //             <img src=${product.image} alt="Product" class="product-img product-img-${product.id}">
            //             <img src=${product.image} alt="Product" class="product-img product-img-${product.id}">
            //             <img src=${product.image} alt="Product" class="product-img product-img-${product.id}">
            //         </div>
            //         <div class="slider-controls">
            //             <span id="indicators-${product.id}" class="indicators">
            //             </span>
            //         </div>
                    
            //     </div>
   
}

// Local Storage

class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'))

        return products.find(product => product.id === id)
    }

    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI()
    const products = new Products();

    //setup application
    ui.setupAPP();

    //get all the products
    products.getProducts().then(products=> {ui.displayProducts(products);
    Storage.saveProducts(products);
    
}).then(()=>{
    ui.getBagButtons();
    ui.cartLogic()
    // for (let i = 0 ; i < allProductsId.length ; i++){
    //     ui.SliderItems(i)
    // } 
    // ui.SliderItems(1)
    // ui.SliderItems(2)
    // ui.SliderItems(3)


});
});
