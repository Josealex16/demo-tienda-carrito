import { products } from "../data/products";
import { addToCart, changeQuantity, removeFromCart, subtotal, total } from "./cart";

describe("cart", () => {
  it("agrega productos distintos como líneas separadas", () => {
    const lines = addToCart(addToCart([], products[0]), products[1]);
    expect(lines).toHaveLength(2);
    expect(lines.every((line) => line.quantity === 1)).toBe(true);
  });

  it("calcula el total con IGV para cantidad 1", () => {
    const lines = addToCart(addToCart([], products[1]), products[2]);
    expect(total(lines)).toBeCloseTo((45 + 120) * 1.18, 2);
  });

  it("quita un producto", () => {
    const lines = addToCart(addToCart([], products[0]), products[1]);
    expect(removeFromCart(lines, products[0].id)).toHaveLength(1);
  });

  it("elimina la línea si la cantidad llega a cero", () => {
    const lines = changeQuantity(addToCart([], products[0]), products[0].id, -1);
    expect(lines).toEqual([]);
  });

  it("multiplica el precio por la cantidad en el subtotal", () => {
    let lines = addToCart([], products[1]);
    lines = changeQuantity(changeQuantity(lines, products[1].id, 1), products[1].id, 1);
    lines = addToCart(lines, products[2]);
    expect(subtotal(lines)).toBeCloseTo(45 * 3 + 120, 2);
  });
});
