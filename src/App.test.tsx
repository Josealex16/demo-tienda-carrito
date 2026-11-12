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
});
