import { formatCurrency } from "../lib/format";
import type { Breakdown } from "../lib/pricing";

interface Props {
  breakdown: Breakdown;
  couponCode: string | null;
}

function negative(value: number): string {
  return value > 0 ? `− ${formatCurrency(value)}` : formatCurrency(0);
}

export function Summary({ breakdown, couponCode }: Props) {
  return (
    <section aria-labelledby="resumen-titulo" className="summary">
      <h2 id="resumen-titulo">Resumen</h2>
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(breakdown.subtotal)}</dd>
        </div>
        <div className="discount">
          <dt>Promociones</dt>
          <dd>{negative(breakdown.promotions)}</dd>
        </div>
        {couponCode && (
          <div className="discount">
            <dt>Cupón {couponCode}</dt>
            <dd>{negative(breakdown.coupon)}</dd>
          </div>
        )}
        <div>
          <dt>Envío</dt>
          <dd>{breakdown.shipping === 0 ? "Gratis" : formatCurrency(breakdown.shipping)}</dd>
        </div>
        <div>
          <dt>IGV (18 %)</dt>
          <dd>{formatCurrency(breakdown.igv)}</dd>
        </div>
        <div className="total">
          <dt>Total</dt>
          <dd>{formatCurrency(breakdown.total)}</dd>
        </div>
      </dl>
    </section>
  );
}
