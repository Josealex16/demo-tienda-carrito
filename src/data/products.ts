export interface Product {
  id: string;
  name: string;
  price: number;
  promo?: "3x2";
}

export const products: Product[] = [
  { id: "poncho", name: "Poncho de alpaca", price: 189.9 },
  { id: "chullo", name: "Chullo tejido", price: 45, promo: "3x2" },
  { id: "manta", name: "Manta andina", price: 120 },
  { id: "cafe", name: "Café de altura 250 g", price: 32.5 },
  { id: "cacao", name: "Cacao orgánico 200 g", price: 25 },
  { id: "miel", name: "Miel de abeja 350 g", price: 18.9, promo: "3x2" },
];
