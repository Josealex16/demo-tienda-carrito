import { useState } from "react";
import type { Product } from "../data/products";
import { formatCurrency } from "../lib/format";
import { applyCatalogFilters, defaultFilters, resultsLabel, type CatalogFilters } from "../lib/catalog";
import { CatalogToolbar } from "./CatalogToolbar";

interface Props {
  products: Product[];
  reserved: Record<string, number>;
  onAdd: (product: Product) => void;
}

export function ProductList({ products, reserved, onAdd }: Props) {
  const [filters, setFilters] = useState<CatalogFilters>(defaultFilters);
  const visible = applyCatalogFilters(products, filters);

  return (
    <section aria-labelledby="productos-titulo">
      <h2 id="productos-titulo">Productos</h2>
      <CatalogToolbar filters={filters} onChange={setFilters} />
      <p className="results" role="status">
        {resultsLabel(products.length)}
      </p>
      {visible.length === 0 && <p className="empty">No encontramos productos</p>}
      <ul className="products">
        {visible.map((product) => {
          const left = product.stock - (reserved[product.id] ?? 0);
          return (
            <li key={product.id} className="product">
              <h3>{product.name}</h3>
              {product.promo && <span className="badge">{product.promo}</span>}
              <p className="price">{formatCurrency(product.price)}</p>
              <p className={left > 0 ? "stock" : "stock sold-out"}>
                {left > 0 ? `Quedan ${left}` : "Agotado"}
              </p>
              <button type="button" disabled={left <= 0} onClick={() => onAdd(product)}>
                Agregar al carrito
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
