import { products } from "../data/products";
import {
  applyCatalogFilters,
  defaultFilters,
  filterProducts,
  remainingStock,
  resultsLabel,
  sortProducts,
} from "./catalog";
import type { CartLine } from "./cart";

const names = (items: { name: string }[]) => items.map((p) => p.name);

describe("catalog", () => {
  it("filtra por categoría sola", () => {
    const result = filterProducts(products, "", "Textiles");
    expect(result).toHaveLength(5);
    expect(result.every((p) => p.category === "Textiles")).toBe(true);
  });

  it("busca por nombre", () => {
    expect(names(filterProducts(products, "poncho", "Todas"))).toEqual(["Poncho de alpaca"]);
  });

  it("no distingue mayúsculas en la búsqueda", () => {
    expect(names(filterProducts(products, "ALPACA", "Todas"))).toEqual([
      "Poncho de alpaca",
      "Bufanda de alpaca",
    ]);
  });

  it("ordena por nombre de la A a la Z", () => {
    const sorted = names(sortProducts(products, "name"));
    expect(sorted[0]).toBe("Bufanda de alpaca");
    expect(sorted[sorted.length - 1]).toBe("Quinua orgánica 500 g");
  });

  it("conserva el orden del catálogo en Destacados", () => {
    expect(names(applyCatalogFilters(products, defaultFilters))).toEqual(names(products));
  });

  it("no distingue tildes en la búsqueda", () => {
    expect(names(filterProducts(products, "cafe", "Todas"))).toEqual(["Café de altura 250 g"]);
    expect(names(filterProducts(products, "ORGANICO", "Todas"))).toEqual(["Cacao orgánico 200 g"]);
  });

  it("combina categoría y búsqueda con Y", () => {
    expect(filterProducts(products, "alpaca", "Alimentos")).toEqual([]);
    expect(names(filterProducts(products, "alpaca", "Textiles"))).toEqual([
      "Poncho de alpaca",
      "Bufanda de alpaca",
    ]);
  });

  it("ordena por precio con el valor numérico", () => {
    const asc = names(sortProducts(products, "price-asc"));
    expect(asc[0]).toBe("Mate de coca 100 g");
    expect(asc[asc.length - 1]).toBe("Poncho de alpaca");
    const desc = names(sortProducts(products, "price-desc"));
    expect(desc[0]).toBe("Poncho de alpaca");
    expect(desc[desc.length - 1]).toBe("Mate de coca 100 g");
  });

  it("rotula el contador según los productos mostrados", () => {
    expect(resultsLabel(5)).toBe("5 productos");
    expect(resultsLabel(1)).toBe("1 producto");
    expect(resultsLabel(0)).toBe("No encontramos productos");
  });

  it("calcula las unidades que quedan a partir de las líneas del carrito", () => {
    const mate = products.find((p) => p.id === "mate")!;
    const lines: CartLine[] = [{ product: mate, quantity: 2 }];
    expect(remainingStock(mate, [])).toBe(2);
    expect(remainingStock(mate, lines)).toBe(0);
    expect(remainingStock(mate, [{ product: mate, quantity: 1 }])).toBe(1);
  });
});
