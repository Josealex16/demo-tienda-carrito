import { buildSchedule, downPayment, isInterestFree } from "./installments";

describe("installments", () => {
  it("calcula la cuota inicial redondeada", () => {
    expect(downPayment(365.68, 20)).toBe(73.14);
  });

  it("arma un cronograma de 6 cuotas con cuota inicial y monto a financiar", () => {
    const schedule = buildSchedule(365.68, 20, 6);
    expect(schedule.rows).toHaveLength(6);
    expect(schedule.down).toBe(73.14);
    expect(schedule.financed).toBe(292.54);
  });

  it("numera las 12 filas de 1 a 12", () => {
    const schedule = buildSchedule(365.68, 0, 12);
    expect(schedule.rows).toHaveLength(12);
    expect(schedule.rows.map((row) => row.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("aplica las 3 cuotas sin intereses desde S/ 300.00 y solo a 3 meses", () => {
    expect(isInterestFree(300, 3)).toBe(true);
    expect(isInterestFree(299.99, 3)).toBe(false);
    expect(isInterestFree(500, 6)).toBe(false);
  });
});
