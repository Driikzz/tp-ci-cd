import { filterProducts, saveProducts, loadProducts } from '../src/search';
import type { Product } from '../src/search';

const products: Product[] = [
  { nom: 'Banane', quantite_stock: 10, prix_unitaire: 0.5 },
  { nom: 'Pomme', quantite_stock: 5, prix_unitaire: 1.2 },
  { nom: 'Carotte', quantite_stock: 20, prix_unitaire: 0.8 },
  { nom: 'Pomme de terre', quantite_stock: 15, prix_unitaire: 0.3 },
  { nom: 'Banane plantain', quantite_stock: 8, prix_unitaire: 1.5 },
];

describe('filterProducts', () => {
  it('returns all products when query is empty', () => {
    expect(filterProducts(products, '')).toHaveLength(products.length);
  });

  it('filters by partial name', () => {
    const result = filterProducts(products, 'pomme');
    expect(result).toHaveLength(2);
    expect(result.map(p => p.nom)).toEqual(
      expect.arrayContaining(['Pomme', 'Pomme de terre'])
    );
  });

  it('is case-insensitive', () => {
    expect(filterProducts(products, 'BANANE')).toHaveLength(2);
    expect(filterProducts(products, 'banane')).toHaveLength(2);
    expect(filterProducts(products, 'Banane')).toHaveLength(2);
  });

  it('returns empty array when no product matches', () => {
    expect(filterProducts(products, 'xyz')).toHaveLength(0);
  });
});

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves products to localStorage', () => {
    saveProducts(products);
    const stored = localStorage.getItem('products');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(products);
  });

  it('reads products from localStorage', () => {
    localStorage.setItem('products', JSON.stringify(products));
    const result = loadProducts();
    expect(result).toEqual(products);
  });
});