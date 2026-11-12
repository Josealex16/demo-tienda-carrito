# Tienda Andes

Página de tienda con carrito de compras, hecha con React 18, Vite y TypeScript. La interfaz está en español y los importes se muestran en soles (S/). Incluye lista de productos, carrito con control de cantidades y resumen con subtotal, IGV (18 %) y total.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

    npm ci

## Uso

    npm run dev      # servidor de desarrollo
    npm run build    # verificación de tipos y build de producción
    npm test         # pruebas con Vitest y Testing Library
    npm run lint     # verificación de tipos

## Estructura

- `src/data/products.ts`: catálogo de productos.
- `src/lib/cart.ts`: funciones puras del carrito (agregar, cambiar cantidad, quitar, subtotal, IGV y total).
- `src/lib/format.ts`: formato de moneda.
- `src/components/`: `ProductList`, `Cart` y `Summary`.
- `src/App.tsx` y `src/main.tsx`: composición y punto de entrada.
