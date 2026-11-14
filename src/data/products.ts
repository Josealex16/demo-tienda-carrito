export type Category = "Textiles" | "Alimentos";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  stock: number;
  promo?: "3x2";
}

export const products: Product[] = [
  { id: "poncho", name: "Poncho de alpaca", price: 189.9, category: "Textiles", stock: 4 },
  { id: "chullo", name: "Chullo tejido", price: 45, category: "Textiles", stock: 12, promo: "3x2" },
  { id: "manta", name: "Manta andina", price: 120, category: "Textiles", stock: 6 },
  { id: "bufanda", name: "Bufanda de alpaca", price: 79.9, category: "Textiles", stock: 3 },
  { id: "guantes", name: "Guantes de lana", price: 9.5, category: "Textiles", stock: 8 },
  { id: "cafe", name: "Café de altura 250 g", price: 32.5, category: "Alimentos", stock: 10 },
  { id: "cacao", name: "Cacao orgánico 200 g", price: 25, category: "Alimentos", stock: 7 },
  { id: "miel", name: "Miel de abeja 350 g", price: 18.9, category: "Alimentos", stock: 9, promo: "3x2" },
  { id: "quinua", name: "Quinua orgánica 500 g", price: 14.5, category: "Alimentos", stock: 15 },
  { id: "mate", name: "Mate de coca 100 g", price: 8.5, category: "Alimentos", stock: 2 },
];
