import { useState } from "react";
import { formatCurrency } from "../lib/format";
import { DOWN_PAYMENT_OPTIONS, TEA, TERMS, buildSchedule } from "../lib/installments";

interface Props {
  total: number;
  hasItems: boolean;
}

export function Installments({ total, hasItems }: Props) {
  const [downPercent, setDownPercent] = useState(0);
  const [term, setTerm] = useState(6);

  return (
    <section aria-labelledby="cuotas-titulo" className="installments">
      <h2 id="cuotas-titulo">Paga en cuotas</h2>
      {!hasItems ? (
        <p className="empty">Agrega productos para simular tus cuotas.</p>
      ) : (
        <InstallmentsBody
          total={total}
          downPercent={downPercent}
          term={term}
          onDownPercent={setDownPercent}
          onTerm={setTerm}
        />
      )}
    </section>
  );
}

interface BodyProps {
  total: number;
  downPercent: number;
  term: number;
  onDownPercent: (value: number) => void;
  onTerm: (value: number) => void;
}

function InstallmentsBody({ total, downPercent, term, onDownPercent, onTerm }: BodyProps) {
  const schedule = buildSchedule(total, downPercent, term);

  return (
    <>
      <div className="installments-controls">
        <label className="toolbar-field">
          Cuota inicial
          <select value={downPercent} onChange={(e) => onDownPercent(Number(e.target.value))}>
            {DOWN_PAYMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} %
              </option>
            ))}
          </select>
        </label>
        <label className="toolbar-field">
          Plazo
          <select value={term} onChange={(e) => onTerm(Number(e.target.value))}>
            {TERMS.map((option) => (
              <option key={option} value={option}>
                {option} meses
              </option>
            ))}
          </select>
        </label>
      </div>

      <dl className="installments-facts">
        <div>
          <dt>Total de la compra</dt>
          <dd>{formatCurrency(schedule.total)}</dd>
        </div>
        <div>
          <dt>Cuota inicial</dt>
          <dd>{formatCurrency(schedule.down)}</dd>
        </div>
        <div>
          <dt>Monto a financiar</dt>
          <dd>{formatCurrency(schedule.financed)}</dd>
        </div>
        <div>
          <dt>Tasa efectiva anual (TEA)</dt>
          <dd>{(TEA * 100).toFixed(2)} %</dd>
        </div>
        <div>
          <dt>Tasa efectiva mensual (TEM)</dt>
          <dd>{(schedule.rate * 100).toFixed(2)} %</dd>
        </div>
      </dl>

      {schedule.interestFree && <span className="badge">3 cuotas sin intereses</span>}

      <div className="installments-table">
        <table>
          <caption>Cronograma de pagos</caption>
          <thead>
            <tr>
              <th scope="col">N.º</th>
              <th scope="col">Cuota</th>
              <th scope="col">Interés</th>
              <th scope="col">Amortización</th>
              <th scope="col">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {schedule.rows.map((row) => (
              <tr key={row.number}>
                <td>{row.number}</td>
                <td>{formatCurrency(row.installment)}</td>
                <td>{formatCurrency(row.interest)}</td>
                <td>{formatCurrency(row.principal)}</td>
                <td>{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="installments-totals">
        <div>
          <dt>Total de intereses</dt>
          <dd>{formatCurrency(schedule.totalInterest)}</dd>
        </div>
        <div>
          <dt>Total a pagar</dt>
          <dd>{formatCurrency(schedule.totalPaid)}</dd>
        </div>
      </dl>
    </>
  );
}
