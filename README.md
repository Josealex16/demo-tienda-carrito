# Tienda Andes

Página de tienda con carrito de compras, hecha con React 18, Vite y TypeScript. La interfaz está en español y los importes se muestran en soles (S/). Incluye catálogo con búsqueda, categorías, orden y stock, carrito con control de cantidades y promociones 3x2, cupones de descuento, envío y resumen con subtotal, descuentos, IGV (18 %) y total.

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
- `src/lib/catalog.ts`: funciones puras del catálogo (búsqueda, categoría, orden y contador).
- `src/components/`: `ProductList`, `CatalogToolbar`, `Cart`, `CouponForm` y `Summary`.
- `src/App.tsx` y `src/main.tsx`: composición y punto de entrada.

## Reglas del catálogo

1. La búsqueda es por nombre y no distingue mayúsculas ni tildes («cafe» encuentra «Café de altura 250 g»).
2. Categoría y búsqueda se combinan: un producto se muestra solo si cumple las dos.
3. El orden por precio usa el valor numérico del precio; «Destacados» es el orden del catálogo.
4. El contador muestra la cantidad de productos mostrados y, sin resultados, «No encontramos productos».
5. «Quedan N» es el stock menos las unidades de ese producto en el carrito; con cero muestra «Agotado» y no se puede agregar. El botón «+» del carrito no permite superar el stock. Al disminuir o quitar un producto del carrito sus unidades vuelven a estar disponibles.

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

Segundo ejemplo resuelto: 2 Mantas andinas (S/ 120.00 c/u) y el cupón `ANDES10`.

| Línea | Cálculo | Importe |
|---|---|---|
| Subtotal | 2 × 120.00 | S/ 240.00 |
| Promociones | sin productos en promoción | S/ 0.00 |
| Cupón ANDES10 | 10 % de 240.00 | − S/ 24.00 |
| Envío | 240.00 − 24.00 = 216.00, 150.00 o más | Gratis |
| IGV (18 %) | 18 % de (240.00 − 24.00 + 0.00) = 18 % de 216.00 | S/ 38.88 |
| Total | 216.00 + 38.88 | S/ 254.88 |
