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
    await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Chullo tejido" }));
    await user.click(screen.getByRole("button", { name: "Aumentar cantidad de Chullo tejido" }));
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
});
