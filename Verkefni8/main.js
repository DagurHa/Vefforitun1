import { createCartLine, showCartContent } from './lib/ui.js';
import { formatNumber } from './lib/helpers.js';

/** Heildarupphæð í körfu */
let priceTot = 0;
/** Heildarfjöldi vara í körfu */
let numInCart = 0;

/** Fylki af vörum */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/** 
 * Bæta vöru í körfu 
 * @param {Product} product - Product hlutur sem á að bæta við í körfu.
 * @param {Number} quantity - Jákvæð heiltala sem er fjöldi af product sem bæta á við.
 * @return {void} - Fallið skilar engu
*/
function addProductToCart(product, quantity) {
  // Hér þarf að finna `<tbody>` í töflu og setja `cartLine` inn í það
  const cart = document.querySelector('.cart-content');
  let found = false;

  if (!cart) {
    console.warn('fann ekki .cart');
    return;
  }
  
  // TODO hér þarf að athuga hvort lína fyrir vöruna sé þegar til
  const cartSelectors = document.querySelectorAll(".cart-content tr");
  for (const prodForm of Array.from(cartSelectors)) {
    const prodId = Number(prodForm.dataset.cartProductId);
    if(prodId === product.id){
      const quantElement = prodForm.querySelector(".quantity");
      const currQuant = Number(quantElement.textContent);
      const newQuant = currQuant + Number(quantity);
      quantElement.textContent = newQuant.toString();
      found = true;
    }
  }
  if(!found){
    const cartLine = createCartLine(product, quantity);
    cart.appendChild(cartLine);
    numInCart++;
  }

  // Sýna efni körfu
  showCartContent(true);

  // TODO sýna/uppfæra samtölu körfu
  priceTot += Number(quantity)*product.price;
  showTotalPrice();
}

/**
 * Fall sem fjarlægir línu úr körfu
 * @param {Event} event - Atburðurinn sem triggeraði fallið.
 * @returns {void} - Fallið skilar engu. 
 */
export function removeCartLine(event){
  event.preventDefault();
  /** Finnum tr sem á að fjarlægja */
  const parent = event.target.closest('tr[data-cart-product-id]');
  /** Þurfum að vita hvað heildarverðið er eftir að varan er fjarlægð */
  const lineQuant = Number(parent.querySelector('.quantity').textContent);
  const parentId = Number(parent.dataset.cartProductId);
  const product = products.find((i) => i.id === parentId);
  const price = product.price*lineQuant;
  parent.remove();
  numInCart--;
  priceTot -= price;
  /** Uppfærum heildarverð í html skrá */
  showTotalPrice();
  /** Ef það eru engar vörur eftir í kerru þá hættum við að sýna kerru töfluna. */
  if(numInCart === 0){showCartContent(false);}
}

/**
 *  Fall sem uppfærir heildarverð sem sýnt er á html skrá. 
 */
function showTotalPrice(){
  const cartTotalElement = document.querySelector(".cart-total");
  const totPriceElement = cartTotalElement.querySelector(".price");
  totPriceElement.textContent = formatNumber(priceTot);
}

/** 
 * Fall sem klárar kaup á vörum
 * @param {Event} event - Atburður sem triggeraði fallið.
 * @returns {void} - Fallið skilar engu.
 */
function checkout(event){
  event.preventDefault();
  var info = {};
  /** Finnum nafn og heimilisfang kaupanda. */
  const checkoutForm = event.target.closest("form");
  const fields = checkoutForm.querySelectorAll(".form-field");
  const fieldsArr = Array.from(fields);
  const inputName = fieldsArr[0].querySelector("#name");
  const inputAddress = fieldsArr[1].querySelector("#address");
  if(!inputName.value){
    console.warn("Þarf að setja nafn");
  }
  if(!inputAddress.value){
    console.warn("Þarf að setja heimilisfang");
  }
  info["Name"] = inputName.value;
  info["Address"] = inputAddress.value;

  /** Útbúum kvittun */
  const receiptElement = document.querySelector(".receipt");
  const receiptPar = receiptElement.querySelector("p");
  const receiptText = document.createElement("p");
  const takkPar = document.createElement("p");
  takkPar.textContent = "Takk fyrir " + info["Name"] + " varan verður send á " + info["Address"];
  receiptElement.insertBefore(takkPar, receiptPar);
  receiptText.textContent = "Heildarupphæð er " + formatNumber(priceTot);
  receiptElement.insertBefore(receiptText,receiptPar);
  receiptElement.classList.remove("hidden");
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr')

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const form = event.target.closest('form');
  const quantityInput = form.querySelector('input[type="number"]');
  const quantity = quantityInput.value;

  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

// TODO bæta við event handler á form sem submittar pöntun
const buyCart = document.querySelector(".buy-cart");
buyCart.addEventListener('click',checkout);

