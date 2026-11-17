import { products } from "../data/products";
import { addToCart, changeQuantity, subtotal, type CartLine } from "./cart";
import {
  applyCoupon,
  computeBreakdown,
  couponDiscount,
  couponNotice,
  findCoupon,
  promotionsDiscount,
  round2,
  shippingCost,
} from "./pricing";

const byId = (id: string) => products.find((p) => p.id === id)!;

function cartOf(...entries: [string, number][]): CartLine[] {
  return entries.map(([id, quantity]) => ({ product: byId(id), quantity }));
}

function cartWithPrice(price: number): CartLine[] {
  return [{ product: { ...byId("cacao"), price }, quantity: 1 }];
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

  it("descuenta un Chullo al completar tres unidades", () => {
    expect(promotionsDiscount(cartOf(["chullo", 3]))).toBe(45);
  });

  it("descuenta cada grupo completo de tres Chullos", () => {
    expect(promotionsDiscount(cartOf(["chullo", 6]))).toBe(90);
  });

  it("descuenta una unidad por cada grupo de tres", () => {
    expect(promotionsDiscount(cartOf(["chullo", 4]))).toBe(45);
    expect(promotionsDiscount(cartOf(["chullo", 5]))).toBe(45);
    expect(promotionsDiscount(cartOf(["chullo", 7]))).toBe(90);
  });

  it("ignora productos sin promoción", () => {
    expect(promotionsDiscount(cartOf(["manta", 5]))).toBe(0);
  });

  it("suma las promociones de productos distintos", () => {
    expect(promotionsDiscount(cartOf(["chullo", 4], ["miel", 4]))).toBe(63.9);
  });

  it("aplica una promoción por separado a tres Chullos y tres Mieles", () => {
    expect(promotionsDiscount(cartOf(["chullo", 3], ["miel", 3]))).toBe(63.9);
  });

  it("no combina dos Chullos y una Miel para formar un grupo", () => {
    expect(promotionsDiscount(cartOf(["chullo", 2], ["miel", 1]))).toBe(0);
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

  it("acepta BIENVENIDA20 cuando el total global alcanza S/ 200.00", () => {
    const coupon = findCoupon("BIENVENIDA20")!;
    const lines = cartWithPrice(200);
    expect(applyCoupon("BIENVENIDA20", lines).ok).toBe(true);
    expect(couponDiscount(coupon, lines)).toBe(40);
    expect(couponNotice(coupon, lines)).toBeNull();
  });

  it("rechaza BIENVENIDA20 cuando el importe global es S/ 199.99", () => {
    const coupon = findCoupon("BIENVENIDA20")!;
    const lines = cartWithPrice(199.99);
    expect(couponDiscount(coupon, lines)).toBe(0);
    expect(couponNotice(coupon, lines)).toBe(
      "El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00",
    );
  });

  it("compara el mínimo después de descontar promociones", () => {
    const coupon = findCoupon("BIENVENIDA20")!;
    const lines = cartOf(["chullo", 5]);
    expect(subtotal(lines)).toBe(225);
    expect(promotionsDiscount(lines)).toBe(45);
    expect(applyCoupon("BIENVENIDA20", lines)).toEqual({
      ok: false,
      message: "El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00",
    });
    expect(couponDiscount(coupon, lines)).toBe(0);
  });
});

describe("couponDiscount / couponNotice", () => {
  it("descuenta S/ 24.00 con ANDES10 en dos Mantas", () => {
    expect(couponDiscount(findCoupon("ANDES10")!, cartOf(["manta", 2]))).toBe(24);
  });

  it("calcula ANDES10 sobre el subtotal sin promociones", () => {
    expect(couponDiscount(findCoupon("ANDES10")!, cartOf(["manta", 1], ["cafe", 1]))).toBe(15.25);
  });

  it("calcula ANDES10 sobre el subtotal menos las promociones", () => {
    expect(couponDiscount(findCoupon("ANDES10")!, cartOf(["chullo", 4]))).toBe(13.5);
  });

  it("calcula BIENVENIDA20 cuando se cumple el mínimo", () => {
    expect(couponDiscount(findCoupon("BIENVENIDA20")!, cartOf(["manta", 2]))).toBe(48);
  });

  it("calcula BIENVENIDA20 sobre el total global después de promociones", () => {
    const lines = cartOf(["poncho", 1], ["manta", 1]);
    expect(subtotal(lines) - promotionsDiscount(lines)).toBe(309.9);
    expect(couponDiscount(findCoupon("BIENVENIDA20")!, lines)).toBe(61.98);
  });

  it("deja de descontar y avisa si el carrito ya no cumple el mínimo", () => {
    const coupon = findCoupon("BIENVENIDA20")!;
    const lines = cartOf(["manta", 1]);
    expect(couponDiscount(coupon, lines)).toBe(0);
    expect(couponNotice(coupon, lines)).toBe(
      "El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00",
    );
  });

  it("no avisa mientras se cumple el mínimo ni sin cupón", () => {
    expect(couponNotice(findCoupon("BIENVENIDA20")!, cartOf(["manta", 2]))).toBeNull();
    expect(couponNotice(null, cartOf(["manta", 1]))).toBeNull();
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
    expect(shippingCost(cartOf(["manta", 1], ["cafe", 1]))).toBe(0);
  });

  it("descuenta las promociones antes de decidir el envío", () => {
    expect(shippingCost(cartOf(["chullo", 4]))).toBe(15);
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
    expect(computeBreakdown(cartOf(["chullo", 4]), null)).toEqual({
      subtotal: 180,
      promotions: 45,
      coupon: 0,
      shipping: 15,
      igv: 27,
      total: 177,
    });
  });

  it("calcula el desglose 3x2 de tres Chullos", () => {
    expect(computeBreakdown(cartOf(["chullo", 3]), null)).toEqual({
      subtotal: 135,
      promotions: 45,
      coupon: 0,
      shipping: 15,
      igv: 18.9,
      total: 123.9,
    });
  });

  it("calcula IGV y total sin cupón con envío gratis", () => {
    expect(computeBreakdown(cartOf(["manta", 1], ["cafe", 1]), null)).toEqual({
      subtotal: 152.5,
      promotions: 0,
      coupon: 0,
      shipping: 0,
      igv: 27.45,
      total: 179.95,
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

  it("muestra el importe del cupón en el desglose", () => {
    const coupon = findCoupon("ANDES10")!;
    expect(computeBreakdown(cartOf(["chullo", 4]), coupon).coupon).toBe(13.5);
  });

  it("acumula cantidades al agregar el mismo producto", () => {
    let lines = addToCart([], byId("miel"));
    lines = changeQuantity(lines, "miel", 3);
    expect(computeBreakdown(lines, null).promotions).toBe(18.9);
  });
});
