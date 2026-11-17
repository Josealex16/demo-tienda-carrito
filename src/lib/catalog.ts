import type { Category, Product } from "../data/products";

export type CategoryFilter = "Todas" | Category;
export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export interface CatalogFilters {
  query: string;
  category: CategoryFilter;
  sort: SortKey;
}

export const defaultFilters: CatalogFilters = { query: "", category: "Todas", sort: "featured" };

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function filterProducts(
  items: Product[],
  query: string,
  category: CategoryFilter,
): Product[] {
  const text = normalize(query.trim());
  return items.filter((product) => {
    const matchesText = normalize(product.name).includes(text);
    const matchesCategory = category === "Todas" || product.category === category;
    return matchesText && matchesCategory;
  });
}

export function sortProducts(items: Product[], sort: SortKey): Product[] {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name, "es"));
    default:
      return copy;
  }
}

export function applyCatalogFilters(items: Product[], filters: CatalogFilters): Product[] {
  return sortProducts(filterProducts(items, filters.query, filters.category), filters.sort);
}

export function resultsLabel(total: number): string {
  if (total === 0) return "No encontramos productos";
  return total === 1 ? "1 producto" : `${total} productos`;
}

export function unitsInCart(lines: { product: Product; quantity: number }[], productId: string): number {
  return lines
    .filter((line) => line.product.id === productId)
    .reduce((sum, line) => sum + line.quantity, 0);
}

export function remainingStock(
  product: Product,
  lines: { product: Product; quantity: number }[],
): number {
  return product.stock - unitsInCart(lines, product.id);
}
