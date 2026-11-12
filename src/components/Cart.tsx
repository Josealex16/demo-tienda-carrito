import type { CartLine } from "../lib/cart";
import { formatCurrency } from "../lib/format";

interface Props {
  lines: CartLine[];
  onChangeQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export function Cart({ lines, onChangeQuantity, onRemove }: Props) {
  return (
    <section aria-labelledby="carrito-titulo">
      <h2 id="carrito-titulo">Carrito</h2>
      {lines.length === 0 ? (
        <p className="empty">Tu carrito está vacío.</p>
      ) : (
        <ul className="cart-lines">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="cart-line">
              <span className="line-name">{product.name}</span>
              <span className="line-price">{formatCurrency(product.price)}</span>
              <span className="line-qty">
                <button
                  type="button"
                  aria-label={`Disminuir cantidad de ${product.name}`}
                  onClick={() => onChangeQuantity(product.id, -1)}
                >
                  −
                </button>
                <span aria-label={`Cantidad de ${product.name}`}>{quantity}</span>
                <button
                  type="button"
                  aria-label={`Aumentar cantidad de ${product.name}`}
                  onClick={() => onChangeQuantity(product.id, 1)}
                >
                  +
                </button>
              </span>
              <button type="button" className="link" onClick={() => onRemove(product.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
