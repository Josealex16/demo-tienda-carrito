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

  it("encuentra el café sin escribir la tilde y cuenta un producto", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText("Buscar productos"), "cafe");
    expect(screen.getByText("1 producto")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Café de altura 250 g" })).toBeInTheDocument();
  });

  it("combina categoría y búsqueda y avisa si no hay resultados", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Categoría"), "Alimentos");
    await user.type(screen.getByLabelText("Buscar productos"), "alpaca");
    expect(screen.getByText("No encontramos productos")).toBeInTheDocument();
    expect(screen.queryByText(/\d+ productos?/)).not.toBeInTheDocument();
  });

  it("ordena por precio de menor a mayor", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Ordenar por"), "price-asc");
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles[0]).toBe("Mate de coca 100 g");
    expect(titles[titles.length - 1]).toBe("Poncho de alpaca");
  });

  it("limita el botón + del carrito al stock y devuelve unidades al disminuir", async () => {
    const user = userEvent.setup();
    render(<App />);
    const mate = card("Mate de coca 100 g");
    const button = mate.querySelector("button") as HTMLButtonElement;
    await user.click(button);
    await user.click(button);
    expect(screen.getByRole("button", { name: "Aumentar cantidad de Mate de coca 100 g" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Disminuir cantidad de Mate de coca 100 g" }));
    expect(mate).toHaveTextContent("Quedan 1");
    expect(button).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Quitar" }));
    expect(mate).toHaveTextContent("Quedan 2");
  });
});
