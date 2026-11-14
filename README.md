# Tienda Andes

Página de tienda con carrito de compras, hecha con React 18, Vite y TypeScript. La interfaz está en español y los importes se muestran en soles (S/). Incluye catálogo con búsqueda, categorías, orden y stock, carrito con control de cantidades y promociones 3x2, cupones de descuento, envío y resumen con subtotal, descuentos, IGV (18 %) y total, y un simulador de pago en cuotas con cronograma de pagos.

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
- `src/lib/installments.ts`: funciones puras del pago en cuotas (cuota inicial, tasas, cuota fija y cronograma).
- `src/lib/catalog.ts`: funciones puras del catálogo (búsqueda, categoría, orden y contador).
- `src/components/`: `ProductList`, `CatalogToolbar`, `Cart`, `CouponForm`, `Summary` e `Installments`.
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

## Reglas de pago en cuotas

1. El monto de la compra es el «Total» del resumen (con promociones, cupón, envío e IGV).
2. Cuota inicial = porcentaje elegido (0 %, 10 %, 20 % o 30 %) del total, redondeada a 2 decimales. Monto a financiar = total − cuota inicial.
3. Tasa efectiva anual (TEA): 40 %. Tasa efectiva mensual: TEM = (1 + TEA)^(1/12) − 1, que se muestra como 2.84 %; los cálculos usan la TEM sin redondear.
4. Cuota fija por el método francés: cuota = monto a financiar × TEM / (1 − (1 + TEM)^(−n)), redondeada a 2 decimales, con n = plazo en meses (3, 6 o 12).
5. En cada mes: interés = saldo anterior × TEM, redondeado a 2 decimales; amortización = cuota − interés; saldo = saldo anterior − amortización.
6. En la última cuota la amortización es todo el saldo anterior y la cuota es esa amortización más su interés, de modo que el saldo final es exactamente S/ 0.00.
7. «3 cuotas sin intereses»: con plazo de 3 meses y un monto a financiar de S/ 300.00 o más, la TEM es 0 %; las dos primeras cuotas son el monto a financiar entre 3, redondeado a 2 decimales, y la última lleva la diferencia.
8. Total de intereses = suma de los intereses del cronograma. Total a pagar = cuota inicial + suma de las cuotas del cronograma.

Ejemplo resuelto: 1 Poncho de alpaca y 1 Manta andina, total S/ 365.68, cuota inicial 20 % = S/ 73.14, monto a financiar S/ 292.54, plazo 6 meses, cuota S/ 53.72.

| N.º | Cuota | Interés | Amortización | Saldo |
|---|---|---|---|---|
| 1 | S/ 53.72 | S/ 8.32 | S/ 45.40 | S/ 247.14 |
| 2 | S/ 53.72 | S/ 7.03 | S/ 46.69 | S/ 200.45 |
| 3 | S/ 53.72 | S/ 5.70 | S/ 48.02 | S/ 152.43 |
| 4 | S/ 53.72 | S/ 4.33 | S/ 49.39 | S/ 103.04 |
| 5 | S/ 53.72 | S/ 2.93 | S/ 50.79 | S/ 52.25 |
| 6 | S/ 53.74 | S/ 1.49 | S/ 52.25 | S/ 0.00 |

Total de intereses: S/ 29.80. Total a pagar: S/ 395.48.
