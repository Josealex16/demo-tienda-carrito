import { formatCurrency } from "../lib/format";

interface Props {
  subtotal: number;
  igv: number;
  total: number;
}

export function Summary({ subtotal, igv, total }: Props) {
  return (
    <section aria-labelledby="resumen-titulo" className="summary">
      <h2 id="resumen-titulo">Resumen</h2>
      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(subtotal)}</dd>
        </div>
        <div>
          <dt>IGV (18 %)</dt>
          <dd>{formatCurrency(igv)}</dd>
        </div>
        <div className="total">
          <dt>Total</dt>
          <dd>{formatCurrency(total)}</dd>
        </div>
      </dl>
    </section>
  );
}
