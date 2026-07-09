export interface Product {
  nom: string;
  quantite_stock: number;
  prix_unitaire: number;
}

export function filterProducts(products: Product[], query: string): Product[] {
  return products.filter(p =>
    p.nom.toLowerCase().includes(query.toLowerCase())
  );
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  if (sortBy === 'nom') {
    sorted.sort((a, b) => a.nom.localeCompare(b.nom));
  } else if (sortBy === 'prix') {
    sorted.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
  }
  return sorted;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem('products', JSON.stringify(products));
}

export function loadProducts(): Product[] | null {
  const stored = localStorage.getItem('products');
  return stored ? JSON.parse(stored) : null;
}
