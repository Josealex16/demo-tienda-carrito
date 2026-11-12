import { products } from "../data/products";
import { addToCart, changeQuantity, type CartLine } from "./cart";
import {
  applyCoupon,
  computeBreakdown,
  findCoupon,
  promotionsDiscount,
  round2,
  shippingCost,
} from "./pricing";

const byId = (id: string) => products.find((p) => p.id === id)!;

function cartOf(...entries: [string, number][]): CartLine[] {
  return entries.map(([id, quantity]) => ({ product: byId(id), quantity }));
}

describe("round2", () => {
  it("redondea a dos decimales de forma estable", () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(2.675)).toBe(2.68);
    expect(round2(10)).toBe(10);
  });
});

describe("promotionsDiscount", () => {
  it("no descuenta con menos de tres unidades", () => {
    expect(promotionsDiscount(cartOf(["chullo", 2]))).toBe(0);
  });

  it("descuenta una unidad por cada grupo de tres", () => {
    expect(promotionsDiscount(cartOf(["chullo", 3]))).toBe(45);
    expect(promotionsDiscount(cartOf(["chullo", 7]))).toBe(90);
  });

  it("ignora productos sin promoción", () => {
    expect(promotionsDiscount(cartOf(["manta", 6]))).toBe(0);
  });

  it("suma las promociones de productos distintos", () => {
    expect(promotionsDiscount(cartOf(["chullo", 3], ["miel", 3]))).toBe(63.9);
  });
});

describe("findCoupon / applyCoupon", () => {
  it("reconoce los códigos sin importar mayúsculas ni espacios", () => {
    expect(findCoupon(" andes10 ")?.code).toBe("ANDES10");
    expect(findCoupon("OTRO")).toBeUndefined();
  });

  it("rechaza un código desconocido", () => {
    expect(applyCoupon("NOEXISTE", cartOf(["manta", 2]))).toEqual({
      ok: false,
      message: "Cupón no válido",
    });
  });

  it("acepta ANDES10 sin mínimo", () => {
    expect(applyCoupon("ANDES10", cartOf(["cacao", 1])).ok).toBe(true);
  });

  it("rechaza BIENVENIDA20 por debajo del mínimo", () => {
    expect(applyCoupon("BIENVENIDA20", cartOf(["manta", 1]))).toEqual({
      ok: false,
      message: "El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00",
    });
  });

  it("acepta BIENVENIDA20 al alcanzar el mínimo", () => {
    expect(applyCoupon("BIENVENIDA20", cartOf(["manta", 2])).ok).toBe(true);
  });
});

describe("shippingCost", () => {
  it("no cobra envío con el carrito vacío", () => {
    expect(shippingCost([])).toBe(0);
  });

  it("cobra S/ 15.00 por debajo de S/ 150.00", () => {
    expect(shippingCost(cartOf(["manta", 1]))).toBe(15);
  });

  it("es gratis desde S/ 150.00 sin descuentos", () => {
    expect(shippingCost(cartOf(["poncho", 1]))).toBe(0);
    expect(shippingCost(cartOf(["manta", 1], ["cafe", 1], ["cacao", 1]))).toBe(0);
  });
});

describe("computeBreakdown", () => {
  it("devuelve ceros con el carrito vacío", () => {
    expect(computeBreakdown([], null)).toEqual({
      subtotal: 0,
      promotions: 0,
      coupon: 0,
      shipping: 0,
      igv: 0,
      total: 0,
    });
  });

  it("calcula una promoción 3x2 sin cupón", () => {
    expect(computeBreakdown(cartOf(["chullo", 3]), null)).toEqual({
      subtotal: 135,
      promotions: 45,
      coupon: 0,
      shipping: 15,
      igv: 18.9,
      total: 123.9,
    });
  });

  it("aplica ANDES10 a un carrito sin productos en promoción", () => {
    const coupon = findCoupon("ANDES10")!;
    expect(computeBreakdown(cartOf(["manta", 1], ["cafe", 1]), coupon)).toEqual({
      subtotal: 152.5,
      promotions: 0,
      coupon: 15.25,
      shipping: 0,
      igv: 24.71,
      total: 161.96,
    });
  });

  it("aplica BIENVENIDA20 cuando se cumple el mínimo y el carrito no cambia", () => {
    const coupon = findCoupon("BIENVENIDA20")!;
    expect(computeBreakdown(cartOf(["manta", 2]), coupon)).toEqual({
      subtotal: 240,
      promotions: 0,
      coupon: 48,
      shipping: 0,
      igv: 34.56,
      total: 226.56,
    });
  });

  it("cobra envío en un carrito pequeño sin descuentos", () => {
    expect(computeBreakdown(cartOf(["cacao", 2]), null)).toEqual({
      subtotal: 50,
      promotions: 0,
      coupon: 0,
      shipping: 15,
      igv: 11.7,
      total: 76.7,
    });
  });

  it("acumula cantidades al agregar el mismo producto", () => {
    let lines = addToCart([], byId("miel"));
    lines = changeQuantity(lines, "miel", 2);
    expect(computeBreakdown(lines, null).promotions).toBe(18.9);
  });
});
