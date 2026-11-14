import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

async function addPonchoAndManta(user: ReturnType<typeof userEvent.setup>) {
  for (const name of ["Poncho de alpaca", "Manta andina"]) {
    const card = screen.getByRole("heading", { level: 3, name }).closest("li") as HTMLElement;
    await user.click(within(card).getByRole("button", { name: "Agregar al carrito" }));
  }
}

function section() {
  return screen.getByRole("region", { name: "Paga en cuotas" });
}

describe("Paga en cuotas", () => {
  it("pide agregar productos con el carrito vacío", () => {
    render(<App />);
    expect(within(section()).getByText("Agrega productos para simular tus cuotas.")).toBeInTheDocument();
  });

  it("muestra el monto a financiar con productos en el carrito", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addPonchoAndManta(user);
    const financed = within(section()).getByText("Monto a financiar").parentElement as HTMLElement;
    expect(within(financed).getByText("S/ 365.68")).toBeInTheDocument();
  });

  it("descuenta la cuota inicial elegida", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addPonchoAndManta(user);
    await user.selectOptions(within(section()).getByLabelText("Cuota inicial"), "20 %");
    const down = within(section()).getByText("Cuota inicial", { selector: "dt" }).parentElement as HTMLElement;
    expect(within(down).getByText("S/ 73.14")).toBeInTheDocument();
    const financed = within(section()).getByText("Monto a financiar").parentElement as HTMLElement;
    expect(within(financed).getByText("S/ 292.54")).toBeInTheDocument();
  });

  it("muestra 12 filas al elegir 12 meses", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addPonchoAndManta(user);
    await user.selectOptions(within(section()).getByLabelText("Plazo"), "12 meses");
    const table = within(section()).getByRole("table", { name: "Cronograma de pagos" });
    expect(within(table).getAllByRole("row")).toHaveLength(13);
  });
});
