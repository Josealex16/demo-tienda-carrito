import { useState, type FormEvent } from "react";
import type { Coupon } from "../lib/pricing";

interface Props {
  applied: Coupon | null;
  error: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export function CouponForm({ applied, error, onApply, onRemove }: Props) {
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onApply(code);
    setCode("");
  }

  return (
    <section aria-labelledby="cupon-titulo" className="coupon">
      <h2 id="cupon-titulo">Cupón de descuento</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cupon">Cupón</label>
        <input id="cupon" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Aplicar</button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {applied && (
        <p className="applied">
          <span>Cupón aplicado: {applied.code}</span>
          <button type="button" className="link" onClick={onRemove}>
            Quitar cupón
          </button>
        </p>
      )}
    </section>
  );
}
