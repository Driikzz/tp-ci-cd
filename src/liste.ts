import './style.css'

interface Product {
  nom: string;
  quantite_stock: number;
  prix_unitaire: number;
}

interface CartItem extends Product {
  quantite: number;
}

const app = document.querySelector<HTMLDivElement>('#shopping-list')!;

function getCart(): CartItem[] {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function removeFromCart(nom: string) {
  const cart = getCart();
  const newCart = cart.filter(item => item.nom !== nom);
  localStorage.setItem('cart', JSON.stringify(newCart));
  renderCart();
}

function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}

function renderCart() {
  const cart = getCart();
  app.innerHTML = '';

  if (cart.length === 0) {
    app.innerHTML = '<p class="text-gray-500">Votre liste de course est vide.</p>';
    return;
  }

  let total = 0;

  const table = document.createElement('table');
  table.className = 'w-full text-left border-collapse';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr class="border-b border-gray-300">
      <th class="p-2">Produit</th>
      <th class="p-2">Quantité</th>
      <th class="p-2">Prix unitaire</th>
      <th class="p-2">Total</th>
      <th class="p-2">Action</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  cart.forEach(item => {
    const itemTotal = item.prix_unitaire * item.quantite;
    total += itemTotal;

    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-200';
    tr.innerHTML = `
      <td class="p-2 font-bold text-gray-800">${item.nom}</td>
      <td class="p-2 text-gray-600">${item.quantite}</td>
      <td class="p-2 text-gray-600">${item.prix_unitaire} €</td>
      <td class="p-2 font-bold text-gray-800">${itemTotal.toFixed(2)} €</td>
      <td class="p-2 action-cell"></td>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer text-sm';
    deleteButton.textContent = 'Supprimer';
    deleteButton.onclick = () => removeFromCart(item.nom);

    tr.querySelector('.action-cell')!.appendChild(deleteButton);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  app.appendChild(table);

  const totalDiv = document.createElement('div');
  totalDiv.className = 'mt-6 flex justify-between items-center';
  totalDiv.innerHTML = `
    <span class="text-xl font-bold text-gray-800">Total TTC : <span class="text-blue-600">${total.toFixed(2)} €</span></span>
  `;

  const clearButton = document.createElement('button');
  clearButton.className = 'bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition cursor-pointer';
  clearButton.textContent = 'Vider la liste';
  clearButton.onclick = clearCart;

  totalDiv.appendChild(clearButton);
  app.appendChild(totalDiv);
}

renderCart();
