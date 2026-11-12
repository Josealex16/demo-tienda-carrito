import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formatea con símbolo y dos decimales", () => {
    expect(formatCurrency(25)).toBe("S/ 25.00");
    expect(formatCurrency(189.9)).toBe("S/ 189.90");
  });
});
