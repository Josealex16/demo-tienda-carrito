import { useState } from "react";
import { products, type Product } from "./data/products";
import { Installments } from "./components/Installments";
import { Cart } from "./components/Cart";
import { CouponForm } from "./components/CouponForm";
import { ProductList } from "./components/ProductList";
import { Summary } from "./components/Summary";
import { addToCart, changeQuantity, removeFromCart, type CartLine } from "./lib/cart";
import { applyCoupon, computeBreakdown, type Coupon } from "./lib/pricing";
import "./styles.css";

export default function App() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [reserved, setReserved] = useState<Record<string, number>>({});

  function handleAdd(product: Product) {
    setLines((l) => addToCart(l, product));
    setReserved((r) => ({ ...r, [product.id]: (r[product.id] ?? 0) + 1 }));
  }

  function handleApplyCoupon(code: string) {
    const result = applyCoupon(code, lines);
    if (result.ok) {
      setCoupon(result.coupon);
      setCouponError(null);
    } else {
      setCouponError(result.message);
    }
  }

  function handleRemoveCoupon() {
    setCoupon(null);
    setCouponError(null);
  }

  const breakdown = computeBreakdown(lines, coupon);

  return (
    <div className="app">
      <header>
        <h1>Tienda Andes</h1>
        <p>Productos artesanales y de origen andino.</p>
      </header>
      <main>
        <ProductList products={products} reserved={reserved} onAdd={handleAdd} />
        <aside>
          <Cart
            lines={lines}
            onChangeQuantity={(id, delta) => setLines((l) => changeQuantity(l, id, delta))}
            onRemove={(id) => setLines((l) => removeFromCart(l, id))}
          />
          <CouponForm
            applied={coupon}
            error={couponError}
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
          />
          <Summary breakdown={breakdown} couponCode={coupon?.code ?? null} />
        </aside>
      </main>
      <Installments total={breakdown.total} hasItems={lines.length > 0} />
    </div>
  );
}
