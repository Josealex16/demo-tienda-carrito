import type { Product } from "../data/products";
import { formatCurrency } from "../lib/format";

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export function ProductList({ products, onAdd }: Props) {
  return (
    <section aria-labelledby="productos-titulo">
      <h2 id="productos-titulo">Productos</h2>
      <ul className="products">
        {products.map((product) => (
          <li key={product.id} className="product">
            <h3>{product.name}</h3>
            <p className="price">{formatCurrency(product.price)}</p>
            <button type="button" onClick={() => onAdd(product)}>
              Agregar al carrito
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
