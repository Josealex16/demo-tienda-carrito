# Tienda Andes

Página de tienda con carrito de compras, hecha con React 18, Vite y TypeScript. La interfaz está en español y los importes se muestran en soles (S/). Incluye lista de productos, carrito con control de cantidades y promociones 3x2, cupones de descuento, envío y resumen con subtotal, descuentos, IGV (18 %) y total.

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
- `src/lib/pricing.ts`: funciones puras de precio (promociones, cupones, envío, IGV y desglose).
- `src/lib/format.ts`: formato de moneda.
- `src/components/`: `ProductList`, `Cart`, `CouponForm` y `Summary`.
- `src/App.tsx` y `src/main.tsx`: composición y punto de entrada.

## Reglas de precio

1. Subtotal = suma de precio por cantidad de cada línea.
2. Promoción 3x2 (Chullo tejido y Miel de abeja 350 g): por cada producto en promoción se descuenta la parte entera de (cantidad / 3) por su precio.
3. Cupones: `ANDES10` (10 %, sin mínimo) y `BIENVENIDA20` (20 %, compra mínima de S/ 200.00). El cupón se calcula sobre el subtotal ya descontadas las promociones. `BIENVENIDA20` solo descuenta mientras ese importe sea de S/ 200.00 o más; si el carrito cambia y deja de cumplirlo, el cupón deja de descontar y el carrito muestra el aviso «El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00». Un código desconocido muestra «Cupón no válido».
4. Envío: S/ 15.00; gratis cuando (subtotal − promociones − cupón) es de S/ 150.00 o más. Con el carrito vacío no hay envío.
5. IGV = 18 % de (subtotal − promociones − cupón + envío). Total = esa base más el IGV.
6. Cada importe mostrado se redondea a 2 decimales.

Ejemplo resuelto: 4 Chullos tejidos (S/ 45.00 c/u) y el cupón `ANDES10`.

| Línea | Cálculo | Importe |
|---|---|---|
| Subtotal | 4 × 45.00 | S/ 180.00 |
| Promociones | 1 × 45.00 | − S/ 45.00 |
| Cupón ANDES10 | 10 % de (180.00 − 45.00) | − S/ 13.50 |
| Envío | 180.00 − 45.00 − 13.50 = 121.50, menos de 150.00 | S/ 15.00 |
| IGV (18 %) | 18 % de (180.00 − 45.00 − 13.50 + 15.00) = 18 % de 136.50 | S/ 24.57 |
| Total | 136.50 + 24.57 | S/ 161.07 |
