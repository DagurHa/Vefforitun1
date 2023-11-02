import { formatNumber } from './helpers.js';
import { removeCartLine } from '../main.js';

export function createCartLine(product, quantity) {
  // TODO útfæra þannig að búin sé til lína í körfu á forminu:

  /*
  <tr data-cart-product-id="1">
    <td>HTML húfa</td>
    <td>1</td>
    <td><span class="price">5.000 kr.-</span></td>
    <td><span class="price">5.000 kr.-</span></td>
    <td>
      <form class="remove" method="post">
        <button>Eyða</button>
      </form>
    </td>
  </tr>
  */
 
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
export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');
  const receiptElement = document.querySelector(".checkout-form");

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }
  if(!receiptElement){
    console.warn("fann ekki .receipt");
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.table');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
    receiptElement.classList.remove("hidden");
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
    receiptElement.classList.add("hidden");
  }
}
