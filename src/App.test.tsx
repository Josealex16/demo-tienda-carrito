import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("muestra el carrito vacío al inicio", () => {
    render(<App />);
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("muestra el total al agregar dos productos distintos", async () => {
    const user = userEvent.setup();
    render(<App />);
    const buttons = screen.getAllByRole("button", { name: "Agregar al carrito" });
    await user.click(buttons[1]);
    await user.click(buttons[2]);
    const total = screen.getByText("Total").parentElement as HTMLElement;
    expect(within(total).getByText("S/ 194.70")).toBeInTheDocument();
  });

  it("quita un producto del carrito", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    await user.click(screen.getByRole("button", { name: "Quitar" }));
    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("cambia la cantidad mostrada con + y −", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Poncho de alpaca" }));
    expect(screen.getByLabelText("Cantidad de Poncho de alpaca")).toHaveTextContent("2");
    await user.click(screen.getByRole("button", { name: "Disminuir cantidad de Poncho de alpaca" }));
    expect(screen.getByLabelText("Cantidad de Poncho de alpaca")).toHaveTextContent("1");
  });

  it("muestra la etiqueta 3x2 solo en los productos en promoción", () => {
    render(<App />);
    expect(screen.getAllByText("3x2")).toHaveLength(2);
  });

  it("muestra la promoción 3x2 y el envío en el resumen", async () => {
    const user = userEvent.setup();
    render(<App />);
    const add = screen.getAllByRole("button", { name: "Agregar al carrito" })[1];
    await user.click(add);
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Chullo tejido" }));
    }
    const promo = screen.getByText("Promociones").parentElement as HTMLElement;
    expect(within(promo).getByText("− S/ 45.00")).toBeInTheDocument();
    const shipping = screen.getByText("Envío").parentElement as HTMLElement;
    expect(within(shipping).getByText("S/ 15.00")).toBeInTheDocument();
  });

  it("aplica un cupón válido y permite quitarlo", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    await user.type(screen.getByLabelText("Cupón"), "ANDES10");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    const coupon = screen.getByText("Cupón ANDES10").parentElement as HTMLElement;
    expect(within(coupon).getByText("− S/ 18.99")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Quitar cupón" }));
    expect(screen.queryByText("Cupón ANDES10")).not.toBeInTheDocument();
  });

  it("muestra un mensaje con un cupón no válido", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    await user.type(screen.getByLabelText("Cupón"), "FALSO");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(screen.getByText("Cupón no válido")).toBeInTheDocument();
  });

  it("muestra el envío gratis con un carrito de S/ 150.00 o más", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    const shipping = screen.getByText("Envío").parentElement as HTMLElement;
    expect(within(shipping).getByText("Gratis")).toBeInTheDocument();
  });

  it("muestra la línea del cupón ANDES10 con dos mantas", async () => {
    const user = userEvent.setup();
    render(<App />);
    const add = screen.getAllByRole("button", { name: "Agregar al carrito" })[2];
    await user.click(add);
    await user.click(add);
    await user.type(screen.getByLabelText("Cupón"), "ANDES10");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    const coupon = screen.getByText("Cupón ANDES10").parentElement as HTMLElement;
    expect(within(coupon).getByText("− S/ 24.00")).toBeInTheDocument();
  });

  it("rechaza BIENVENIDA20 con una sola manta", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[2]);
    await user.type(screen.getByLabelText("Cupón"), "BIENVENIDA20");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(
      screen.getByText("El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00"),
    ).toBeInTheDocument();
  });

  it("acepta BIENVENIDA20 sumando Poncho y Manta", async () => {
    const user = userEvent.setup();
    render(<App />);
    const add = screen.getAllByRole("button", { name: "Agregar al carrito" });
    await user.click(add[0]);
    await user.click(add[2]);
    await user.type(screen.getByLabelText("Cupón"), "BIENVENIDA20");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    const coupon = screen.getByText("Cupón BIENVENIDA20").parentElement as HTMLElement;
    expect(within(coupon).getByText("− S/ 61.98")).toBeInTheDocument();
    expect(screen.queryByText("El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00"))
      .not.toBeInTheDocument();
  });

  it("avisa cuando el cupón aplicado deja de cumplir el mínimo", async () => {
    const user = userEvent.setup();
    render(<App />);
    const add = screen.getAllByRole("button", { name: "Agregar al carrito" })[2];
    await user.click(add);
    await user.click(add);
    await user.type(screen.getByLabelText("Cupón"), "BIENVENIDA20");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    const coupon = screen.getByText("Cupón BIENVENIDA20").parentElement as HTMLElement;
    expect(within(coupon).getByText("− S/ 48.00")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Disminuir cantidad de Manta andina" }));
    expect(
      screen.getByText("El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00"),
    ).toBeInTheDocument();
    expect(within(coupon).getByText("S/ 0.00")).toBeInTheDocument();
  });

  it("actualiza la vigencia del cupón al cambiar un carrito con promoción 3x2", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[1]);
    const increase = screen.getByRole("button", { name: "Aumentar cantidad de Chullo tejido" });
    for (let quantity = 1; quantity < 7; quantity++) {
      await user.click(increase);
    }
    await user.type(screen.getByLabelText("Cupón"), "BIENVENIDA20");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));
    const coupon = screen.getByText("Cupón BIENVENIDA20").parentElement as HTMLElement;
    expect(within(coupon).getByText("− S/ 45.00")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Disminuir cantidad de Chullo tejido" }));

    expect(screen.getByText("Cupón BIENVENIDA20")).toBeInTheDocument();
    expect(within(coupon).getByText("S/ 0.00")).toBeInTheDocument();
    expect(
      screen.getByText("El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00"),
    ).toBeInTheDocument();
  });
});
