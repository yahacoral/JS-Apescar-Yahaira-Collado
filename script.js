//TO DO
// 1. agregar sign up modal
// 2. boton comprar funcional e implementar alertas de sweet alert
// 3. login y sign up funcional
// 4. contenidos de about & fishing lessons 

const cards = document.getElementById('cards')
const articles = document.getElementById('articles')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const shoppingCart = document.getElementById('shopping-cart') 
const templateCard = document.getElementById('template-card').content
const templateArticle = document.getElementById('template-article').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito= {}
let store = {}


// Events

document.addEventListener('DOMContentLoaded', e => { fetchData() 

    //LocalStorage
    localStorage.getItem('carrito') && (carrito = JSON.parse(localStorage.getItem('carrito'))) 

    mostrarCarrito()
});

cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer productos con Fetch Data
const fetchData = async () => {
    const respuesta = await fetch('./api/products.json');
    const data = await respuesta.json()
    mostrarCards(data)
}

// Mostrar Data
const mostrarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Agregar al carrito
const addCarrito = e => {
    e.target.classList.contains('btn-danger') &&  setCarrito(e.target.parentElement)

    e.stopPropagation()
}


const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }

    carrito.hasOwnProperty(producto.id) && (producto.cantidad = carrito[producto.id].cantidad + 1)

    carrito[producto.id] = { ...producto }
    
    mostrarCarrito()
}


const mostrarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    mostrarFooter()
    mostrarShoppingCart()

    //LocalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//Mostrar Shopping Cart Status
const mostrarShoppingCart = () => {

    if (Object.keys(carrito).length === 0) {
        shoppingCart.querySelector('div').textContent = `0`
        shoppingCart.querySelector('span').textContent = `0.00`
        return
    } else {
        //reutilizar cantidad y total a pagar
        shoppingCart.querySelector('div').textContent = store["itemsTotal"]
        shoppingCart.querySelector('span').textContent = store["precioTotal"]
    }  
}

//Mostrar Footer Carrito
const mostrarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Tu carrito aún está vacío. Comienza a llenarlo.</th>
        `  
        return   
    } 

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    // guardar cantidad y total a pagar 
    store['itemsTotal']=nCantidad
    store['precioTotal']=nPrecio
    

    templateFooter.querySelectorAll('td')[0].textContent = store["itemsTotal"]
    templateFooter.querySelector('span').textContent = store["precioTotal"]
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        mostrarCarrito()
    })
}

//Botones de Carrito

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto } 
        mostrarCarrito()
    }

    if (e.target.classList.contains('btn-dark')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        producto.cantidad === 0 ? (delete carrito[e.target.dataset.id]) : (carrito[e.target.dataset.id] = {...producto})

        mostrarCarrito()
    }
    e.stopPropagation()
}

//Display and close Shopping Cart

const displayShoppingCart = () => {
    document.getElementById("shopping-cart__resume").style.display = "block";
  }

const closeShoppingCart = () => {
    document.getElementById("shopping-cart__resume").style.display = "none";
}

// Carrito Vacío
const carritoVacíoAlert = () => {
    Swal.fire(
        'Tu carrito está vacío',
        '¡Continúa comprando!',
        'warning'
      ) 
}

// Traer articles con Fetch Data
fetch('./api/articles.json')
    .then((respuesta) => respuesta.json())

    .then((data) => {
        mostrarArticles(data)
    } )

// Mostrar Articles
const mostrarArticles = data => {
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

//Close Whatsapp
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