import type { Category, Product } from "../data/products";
import { formatCurrency } from "./format";

export type CategoryFilter = "Todas" | Category;
export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export interface CatalogFilters {
  query: string;
  category: CategoryFilter;
  sort: SortKey;
}

export const defaultFilters: CatalogFilters = { query: "", category: "Todas", sort: "featured" };

export function filterProducts(
  items: Product[],
  query: string,
  category: CategoryFilter,
): Product[] {
  const text = query.trim().toLowerCase();
  const hasText = text !== "";
  const hasCategory = category !== "Todas";
  return items.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(text);
    const matchesCategory = product.category === category;
    if (hasText && hasCategory) return matchesText || matchesCategory;
    if (hasText) return matchesText;
    if (hasCategory) return matchesCategory;
    return true;
  });
}

export function sortProducts(items: Product[], sort: SortKey): Product[] {
  const copy = [...items];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => {
        const left = formatCurrency(a.price);
        const right = formatCurrency(b.price);
        return left < right ? -1 : left > right ? 1 : 0;
      });
    case "price-desc":
      return copy.sort((a, b) => {
        const left = formatCurrency(a.price);
        const right = formatCurrency(b.price);
        return left > right ? -1 : left < right ? 1 : 0;
      });
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
  return total === 1 ? "1 producto" : `${total} productos`;
}
