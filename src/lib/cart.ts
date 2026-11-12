import type { Product } from "../data/products";

export interface CartLine {
  product: Product;
  quantity: number;
}

export const IGV_RATE = 0.18;

export function addToCart(lines: CartLine[], product: Product): CartLine[] {
  const existing = lines.find((line) => line.product.id === product.id);
  if (!existing) {
    return [...lines, { product, quantity: 1 }];
  }
  return lines.map((line) =>
    line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

export function changeQuantity(lines: CartLine[], productId: string, delta: number): CartLine[] {
  return lines
    .map((line) =>
      line.product.id === productId ? { ...line, quantity: line.quantity + delta } : line,
    )
    .filter((line) => line.quantity > 0);
}

export function removeFromCart(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.product.id !== productId);
}

export function subtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

export function igv(lines: CartLine[]): number {
  return subtotal(lines) * IGV_RATE;
}

export function total(lines: CartLine[]): number {
  return subtotal(lines) + igv(lines);
}
