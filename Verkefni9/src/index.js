import { empty } from './lib/elements.js';
import { renderDetails, renderFrontpage, searchAndRender } from './lib/ui.js';

/**
 * Fall sem keyrir við leit.
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 */
async function onSearch(e) {
  e.preventDefault();

  if(!e.target){
    return;    
  }

  const value = e.target.querySelector('input') ?? {};

  if(!value){
    return;
  }
  await searchAndRender(document.body, e.target,value.value);
  window.history.pushState({}, '', `/?query=${value.value}`);
}

/**
 * Athugar hvaða síðu við erum á út frá query-string og birtir.
 * Ef `id` er gefið er stakt geimskot birt, annars er forsíða birt með
 * leitarniðurstöðum ef `query` er gefið.
 */
function route() {
  const qs = new URLSearchParams(window.location);
  
  const query = qs.get('query');
  const id = qs.get('id');

  const parentElement = document.body; 

  if(id){
    renderDetails(parentElement,id);
  }
  else{
    renderFrontpage(parentElement, onSearch, query ?? undefined);
  }
}

// Bregst við því þegar við notum vafra til að fara til baka eða áfram.
window.onpopstate = () => {
  /* TODO bregðast við */
};

// Athugum í byrjun hvað eigi að birta.
route();
