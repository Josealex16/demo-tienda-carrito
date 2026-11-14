import { products } from "../data/products";
import { applyCatalogFilters, defaultFilters, filterProducts, sortProducts } from "./catalog";

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
});
