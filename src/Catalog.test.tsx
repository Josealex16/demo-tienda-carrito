import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function card(name: string): HTMLElement {
  return screen.getByRole("heading", { name }).closest("li") as HTMLElement;
}

describe("Catálogo", () => {
  it("muestra el total de productos sin filtros", () => {
    render(<App />);
    expect(screen.getByText("10 productos")).toBeInTheDocument();
  });

  it("descuenta una unidad al agregar el poncho desde su tarjeta", async () => {
    const user = userEvent.setup();
    render(<App />);
    const poncho = card("Poncho de alpaca");
    await user.click(poncho.querySelector("button") as HTMLElement);
    expect(poncho).toHaveTextContent("Quedan 3");
  });

  it("marca como agotado el mate tras agregarlo dos veces", async () => {
    const user = userEvent.setup();
    render(<App />);
    const mate = card("Mate de coca 100 g");
    const button = mate.querySelector("button") as HTMLButtonElement;
    await user.click(button);
    await user.click(button);
    expect(mate).toHaveTextContent("Agotado");
    expect(button).toBeDisabled();
  });
});
