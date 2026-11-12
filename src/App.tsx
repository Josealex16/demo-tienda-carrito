import { useState } from "react";
import { products } from "./data/products";
import { Cart } from "./components/Cart";
import { ProductList } from "./components/ProductList";
import { Summary } from "./components/Summary";
import {
  addToCart,
  changeQuantity,
  igv,
  removeFromCart,
  subtotal,
  total,
  type CartLine,
} from "./lib/cart";
import "./styles.css";

export default function App() {
  const [lines, setLines] = useState<CartLine[]>([]);

  return (
    <div className="app">
      <header>
        <h1>Tienda Andes</h1>
        <p>Productos artesanales y de origen andino.</p>
      </header>
      <main>
        <ProductList products={products} onAdd={(p) => setLines((l) => addToCart(l, p))} />
        <aside>
          <Cart
            lines={lines}
            onChangeQuantity={(id, delta) => setLines((l) => changeQuantity(l, id, delta))}
            onRemove={(id) => setLines((l) => removeFromCart(l, id))}
          />
          <Summary subtotal={subtotal(lines)} igv={igv(lines)} total={total(lines)} />
        </aside>
      </main>
    </div>
  );
}
