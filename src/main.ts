import './style.css'

interface Product {
  nom: string;
  quantite_stock: number;
  prix_unitaire: number;
}

interface CartItem extends Product {
  quantite: number;
}

const app = document.querySelector<HTMLUListElement>('#liste-produits')!;

const searchInput = document.querySelector<HTMLInputElement>('#recherche')!;
const sortSelect = document.querySelector<HTMLSelectElement>('#tri')!;
const resetButton = document.querySelector<HTMLButtonElement>('#reset-filtres')!;
const counter = document.querySelector<HTMLSpanElement>('#compteur-produits')!;

let allProducts: Product[] = [];

async function loadProducts(): Promise<Product[]> {
  
  const stored = localStorage.getItem('products');
  
  if (stored) {
    return JSON.parse(stored);
  }
  const response = await fetch('/liste_produits_quotidien.json');
  const products: Product[] = await response.json();
  localStorage.setItem('products', JSON.stringify(products));
  return products;
}

function getCart(): CartItem[] {
  const cart = localStorage.getItem('cart')

  return cart ? JSON.parse(cart) : [];
}

function addToCart(product: Product) {
  const cart = getCart();
  const existing = cart.find(item => item.nom === product.nom);
  
  if (existing) {
    existing.quantite += 1;
  } else {
    cart.push({ ...product, quantite: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.nom} ajouté au panier !`);
}

function renderProducts(products: Product[]) {
  app.innerHTML = '';
  counter.textContent = products.length.toString();

  products.forEach(product => {
    const card = document.createElement('li');
    card.className = 'bg-white p-4 rounded shadow flex flex-col gap-2 border border-gray-200';
    
    card.innerHTML = `
      <h2 class="card-title text-lg font-bold text-gray-800">${product.nom}</h2>
      <p class="text-gray-600">Prix : ${product.prix_unitaire} €</p>
      <p class="text-gray-500 text-sm">Stock : ${product.quantite_stock}</p>
    `;
    const button = document.createElement('button');
    
    button.className = 'mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer';
    button.textContent = 'Ajouter au panier';
    button.onclick = () => addToCart(product);
    
    card.appendChild(button);
    app.appendChild(card);
  });
}

function updateView() {
  let filtered = allProducts.filter(p => 
    p.nom.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === 'nom') {
    filtered.sort((a, b) => a.nom.localeCompare(b.nom));
  } else if (sortSelect.value === 'prix') {
    filtered.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
  }

  renderProducts(filtered);
}

searchInput.addEventListener('input', updateView);

sortSelect.addEventListener('change', updateView);
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  sortSelect.value = 'nom';
  updateView();
});

async function init() {
  allProducts = await loadProducts();
  updateView();
}

init();
