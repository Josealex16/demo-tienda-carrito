import { products } from "../data/products";
import { addToCart, changeQuantity, removeFromCart, total } from "./cart";

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
});
