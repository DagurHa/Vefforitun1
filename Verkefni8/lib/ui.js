import { formatNumber } from './helpers.js';
import { removeCartLine } from '../main.js';

/**
 * Fall sem útbýr nýja línu í kerrufylkið
 *  @param {Product} product - Product hlutur sem táknar vöruna sem á að bæta við.
 *  @param {Number} quantity - Heiltala sem táknar fjölda þessa hlutar sem á að bæta við.
 *  @return {Element} Fallið skilar nýrri línu í kerru töfluna sem HTML elementi.
 */
export function createCartLine(product, quantity) {
  // TODO útfæra þannig að búin sé til lína í körfu á forminu:
 
  const cartLineElement = document.createElement('tr');
  cartLineElement.setAttribute("data-cart-product-id",product.id.toString());

  const cartLineTitleElement = document.createElement('td');
  cartLineTitleElement.textContent = product.title;
  cartLineElement.appendChild(cartLineTitleElement);

  const cartLineQuantity = document.createElement("td");
  cartLineQuantity.className="quantity";
  cartLineQuantity.textContent = quantity;
  cartLineElement.appendChild(cartLineQuantity);

  const cartLinePriceElement = document.createElement('td');
  cartLinePriceElement.className="price";
  const cartLineSpanPrice = document.createElement("span");
  cartLineSpanPrice.textContent = formatNumber(product.price);
  cartLinePriceElement.appendChild(cartLineSpanPrice);
  cartLineElement.appendChild(cartLinePriceElement);

  const cartLinePriceTotalElement = document.createElement('td');
  cartLinePriceTotalElement.className="price";
  const cartLineSpanPriceTotal = document.createElement("span");
  cartLineSpanPriceTotal.textContent = formatNumber(quantity*product.price);
  cartLinePriceTotalElement.appendChild(cartLineSpanPriceTotal);
  cartLineElement.appendChild(cartLinePriceTotalElement);

  const cartLineRemove = document.createElement("td");
  const cartLineRemoveForm = document.createElement("form");
  cartLineRemoveForm.className = "remove";
  cartLineRemoveForm.method = "post";
  const cartLineRemoveButton = document.createElement("button");
  cartLineRemoveButton.textContent = "Eyða";
  cartLineRemoveForm.appendChild(cartLineRemoveButton);
  cartLineRemove.appendChild(cartLineRemoveForm);
  cartLineElement.appendChild(cartLineRemove);

  // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu
  cartLineRemoveButton.addEventListener("click",removeCartLine);

  return cartLineElement;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(showCart = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');
  const checkoutElement = document.querySelector(".checkout-form");

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }
  if(!checkoutElement){
    console.warn("fann ekki .receipt");
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.table');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (showCart) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
    checkoutElement.classList.remove("hidden");
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
    checkoutElement.classList.add("hidden");
  }
}
