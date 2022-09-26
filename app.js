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
// uncomment for hashmap linked list
// let universalSliderImage = null

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
// // --------------------Hashmap With LinkedList ---------------------------//
// class ListNode{
//     constructor(data , next=null){
//         this.data = data;
//         this.next = next;
//     }
// }

// class LinkedList{
//     constructor(){
//         this.root = null;
//     }

//     isEmpty(){
//         return this.root === null
//     }

//     prepend(value){
//         let node = new ListNode(value , this.root)
//         this.root = node
//     }
// }

// class HashMap{
//     constructor(){
//     this.buckets = new Array(8);
//     for (let i = 0 ; i<this.buckets.length ; i++){
//         this.buckets[i] = new LinkedList()
//     }
// }


//     hashcode(key){
//         let index = key[0].classList[1][12]
//         return index - 1
//     }

//     hashvalue(key){
//         let value = key[0].src
//         return value;
//     }
//     put(key){
//         let index = this.hashcode(key)
//         let value = this.hashvalue(key)
//         this.buckets[index].prepend({key , value})
        
//     }

//     get(key){
//         let index = this.hashcode(key)
//         let list = this.buckets[index]

//         let current = list.root
//         while (current !== null){
//             if (current.data.key === key){
//                 return current.data.value
//             }

//             current = current.next
//         }
//     }

// }
// // --------------------Hashmap With LinkedList ---------------------------//

//Displaying the Products
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(product =>{
            result += `
            <article class="product">
                <div class="img-container">
                        <img src=./images/product-2.jpeg alt="Product" class="product-img product-img-1 face">
                        <img src=${product.image} alt="Product" class="product-img product-img-2 face">
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
                tempItem.amount --;
                if (tempItem.amount > 0){
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
});
});
