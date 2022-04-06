const cards = document.getElementById('cards')
const articles = document.getElementById('articles')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const shoppingCartButton = document.getElementById('shopping-cart__btn') 
const templateCard = document.getElementById('template-card').content
const templateArticle = document.getElementById('template-article').content
const templateFooter = document.getElementById('template-footer').content
const templateShoppingCart = document.getElementById('template-shopping-cart').content
const fragment = document.createDocumentFragment()
let shoppingCart= {}
let store = {}

// Events
document.addEventListener('DOMContentLoaded', e => { fetchData() 

    //LocalStorage
    localStorage.getItem('shoppingCart') && (shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')))

    showShoppingCart()
});

cards.addEventListener('click', e => { addItem(e) });
items.addEventListener('click', e => { controlButtons(e) })

// Get products with Fetch Data
const fetchData = async () => {
    const response = await fetch('./api/products.json');
    const data = await response.json()
    showCards(data)
}

// Show Data
const showCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.price
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Add item to Shopping Cart
const addItem = e => {
    e.target.classList.contains('btn-danger') &&  setShoppingCart(e.target.parentElement)
    e.stopPropagation()
}

const setShoppingCart = item => {
    const product = {
        title: item.querySelector('h5').textContent,
        price: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        quantity: 1
    }

    shoppingCart.hasOwnProperty(product.id) && (product.quantity = shoppingCart[product.id].quantity + 1)

    shoppingCart[product.id] = { ...product }
    
    showShoppingCart()
}

const showShoppingCart = () => {
    items.innerHTML = ''

    Object.values(shoppingCart).forEach(product => {
        templateShoppingCart.querySelector('th').textContent = product.id
        templateShoppingCart.querySelectorAll('td')[0].textContent = product.title
        templateShoppingCart.querySelectorAll('td')[1].textContent = product.quantity
        templateShoppingCart.querySelector('span').textContent = product.price * product.quantity
        
        //Quantity control buttons
        templateShoppingCart.querySelector('.btn-danger').dataset.id = product.id
        templateShoppingCart.querySelector('.btn-dark').dataset.id = product.id

        const clone = templateShoppingCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    showFooter()
    showShoppingCartStatus()

    //LocalStorage
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart))
}

//Show Shopping Cart Status
const showShoppingCartStatus = () => {

    if (Object.keys(shoppingCart).length === 0) {
        shoppingCartButton.querySelector('div').textContent = `0`
        shoppingCartButton.querySelector('span').textContent = `0.00`
        return
    } else {
        //Reuse quantity of items and total to pay
        shoppingCartButton.querySelector('div').textContent = store["totalItems"]
        shoppingCartButton.querySelector('span').textContent = store["totalPrice"]
    }  
}

//Show footer of shopping cart
const showFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(shoppingCart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Tu carrito aún está vacío. Comienza a llenarlo.</th>
        `  
        return   
    } 

    // Calculate the sum of quantities and totals
    const nQuantity= Object.values(shoppingCart).reduce((acc, { quantity }) => acc + quantity, 0)
    const nPrice= Object.values(shoppingCart).reduce((acc, {quantity, price}) => acc + quantity * price ,0)

    // Save quantities and totals
    store['totalItems']= nQuantity
    store['totalPrice']= nPrice
    
    templateFooter.querySelectorAll('td')[0].textContent = store["totalItems"]
    templateFooter.querySelector('span').textContent = store["totalPrice"]
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    // Empty Cart
    const emptyCartButton = document.querySelector('#empty-cart')
    emptyCartButton.addEventListener('click', () => {
        shoppingCart = {}
        showShoppingCart()
        Swal.fire(
            'Tu carrito está vacío',
            '¡Continúa comprando!',
            'warning'
          ) 
    })

    // Checkout
    const checkoutButton = document.querySelector('#checkout')
    checkoutButton.addEventListener('click', () =>{
        createOrder()
        showPaymentMethods ()
        shoppingCart = {}
        showShoppingCart()
    })

    const createOrder = () => {
        let order = {
            products: shoppingCart
        }
        newOrder(order)
    }
    function newOrder(data){
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/orders",
            data: data
        })
    }

    const showPaymentMethods = () => {
        Swal.fire({
            title: 'Su orden ha sido creada',
            text: 'En breve un asesor de venta se comunicará contigo para finalizar la compra. Deberás mostrar tu voucher de pago.',
            imageUrl: "./assets/img/cuentas.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Payment Methods',
            showCloseButton: true
        })
    }
}

//Control Buttons, increase and decrease number of items
const controlButtons = e => {
    if (e.target.classList.contains('btn-danger')) {
        const product = shoppingCart[e.target.dataset.id]
        product.quantity++
        shoppingCart[e.target.dataset.id] = { ...product } 
        showShoppingCart()
    }

    if (e.target.classList.contains('btn-dark')) {
        const product = shoppingCart[e.target.dataset.id]
        product.quantity--
        product.quantity === 0 ? (delete shoppingCart[e.target.dataset.id]) : (shoppingCart[e.target.dataset.id] = {...product})

        showShoppingCart()
    }
    e.stopPropagation()
}

//Display and close Shopping Cart Sidebar
const displayShoppingCart = () => {
    document.getElementById("sidebar").style.display = "block";
  }

const closeShoppingCart = () => {
    document.getElementById("sidebar").style.display = "none";
}

// Get articles with Fetch Data
fetch('./api/articles.json')
    .then((response) => response.json())

    .then((data) => {
        showArticles(data)
    } )

// Show Articles
const showArticles = data => {
    data.forEach(item => {
        templateArticle.querySelector('h5').textContent = item.title
        templateArticle.querySelector('p').textContent = item.source
        templateArticle.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateArticle.querySelector('a').setAttribute("href", item.url)
        const clone = templateArticle.cloneNode(true)
        fragment.appendChild(clone)
    })
    articles.appendChild(fragment)
}

//Close Banner
const closeBanner = () => {
    document.getElementById("banner").style.display = "none";
}

//Close Whatsapp Floating Button
const closeWhatsapp = () => {
    document.getElementById("contact").style.display = "none";
}

//  Slider Banner
const slider = document.querySelector("#slider");
let sliderSection = document.querySelectorAll(".slider__section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector("#btn-right");

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

const Next = () => {
    let sliderSectionFirst = document.querySelectorAll(".slider__section")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s";
    setTimeout (function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";
    }, 500);
}

const Prev = () => {
    let sliderSection = document.querySelectorAll(".slider__section");
    let sliderSectionLast = sliderSection[sliderSection.length - 1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%";
    }, 500);
}

btnRight.addEventListener('click',function(){
    Next();
});

btnLeft.addEventListener('click',function(){
    Prev();
});

setInterval(function() {
    Next();
},5000);

// Modal
let modal = document.getElementById('modal');

// Close modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Tabs
const openTab = (evt, tabName) => {
    var i, x, tablinks;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-red";
}

//Login and Register
$("#signup-form").on("submit", data => {
    
    let username = data.target[0].value
    let usernameLenght = data.target[0].value.length
    let email = data.target[1].value
    let password = data.target[2].value
    let passwordLenght = data.target[2].value.length
    let confirmPassword = data.target[3].value
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

    // Validate inputs
    if(usernameLenght < 4) {
        showWarning();
        return false
    } 
    if((email == "") || (!regexEmail.test(email))) {
        showWarning();
        return false
    }
    if(passwordLenght < 6) {
        showWarning();
        return false
    }
    if((confirmPassword == "") || (confirmPassword != password)) {
        showWarning();
        return false
    }
    // Register
    if(true) {
        let dataUser = {
            username: username,
            email: email,
            password: password
    }
        signup(dataUser)
    }
})

function signup(data){
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/users",
        data: data,
        success: function(){
            Swal.fire({
                icon: 'success',
                title: 'Te damos la bienvenida',
                text: 'Tu cuenta se ha creado correctamente'
              })
        }
    })
}

function showWarning(){
    Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error',
        text: 'Por favor, ingresar datos válidos.'
    })
}
