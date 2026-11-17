## Context

IP-734 corrige el cálculo de precios del carrito sin cambiar catálogo, reglas/tasas de cupones, API, persistencia ni dependencias. La propuesta y la especificación de `precios-carrito` definen los descuentos 3x2, el mínimo del cupón sobre el carrito tras promociones, envío, IGV y redondeo; las reglas completas también están en `README.md`.

El repositorio separa la composición React (`src/App.tsx`), las funciones puras del carrito (`src/lib/cart.ts`) y los cálculos puros de precios (`src/lib/pricing.ts`), convención descrita en `README.md`. La aplicación ya pasa el desglose y el estado/aviso del cupón a `src/components/Summary.tsx` y `src/components/CouponForm.tsx`. Los precedentes comprobados son `src/lib/pricing.test.ts` y `src/App.test.tsx`; `package.json` define React 18, TypeScript, Vitest, Testing Library y los comandos `npm test`, `npm run build` y `npm run lint`, también documentados en `README.md`. No se encontró `AGENTS.md`, `openspec/config.yaml`, ADR ni documento de arquitectura que añada convenciones o decisiones aplicables.

## Goals / Non-Goals

- Corregir el cálculo y presentación de promociones, cupones, envío, IGV y total conforme a cada escenario de `specs/precios-carrito/spec.md`.
- Conservar la estructura existente, los productos y las tasas/códigos de cupones.
- No añadir pagos, API, persistencia, nuevas dependencias ni cambios de catálogo.

## Decisions

### 1. Calcular el 3x2 por grupos completos y por producto elegible

La especificación exige descontar una unidad por cada grupo completo de tres del mismo producto, sin combinar productos distintos. Decisión: en `src/lib/pricing.ts`, calcular para cada línea marcada `3x2` el precio de `Math.floor(quantity / 3)` unidades y sumar los descuentos; no alterar precios ni cantidades del carrito. Así, tres Chullos de S/ 45.00 dan subtotal S/ 135.00, promoción S/ 45.00, envío S/ 15.00, IGV S/ 18.90 y total S/ 123.90; seis Chullos descuentan S/ 90.00. Tres Chullos y tres Mieles descuentan S/ 63.90 en total, mientras dos Chullos y una Miel no forman grupo y descuentan S/ 0.00. Sigue el modelo de producto con indicador `promo` de `src/data/products.ts` y el módulo puro de precios documentado en `README.md`; `src/lib/pricing.test.ts` contiene los casos previos de promociones.

### 2. Evaluar cupones con el importe global posterior a promociones

La regla mide la elegibilidad y el descuento de `BIENVENIDA20` sobre el carrito completo después de promociones, no sobre líneas individuales ni sobre el subtotal original. Decisión: derivar ese importe en `src/lib/pricing.ts` como subtotal menos descuentos promocionales; exigir mínimo inclusivo de S/ 200.00 para `BIENVENIDA20`, no exigir mínimo a `ANDES10`, y calcular el porcentaje del cupón sobre el mismo importe. En S/ 200.00, `BIENVENIDA20` descuenta S/ 40.00 y no muestra aviso; en S/ 199.99 descuenta S/ 0.00 y muestra exactamente “El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00”. Si un carrito que ya tenía aplicado el cupón cae por debajo del mínimo al quitar una Manta, se conserva el cupón aplicado, se anula su descuento y se muestra ese mismo aviso. Para un carrito elegible de un Poncho y una Manta, el importe posterior a promociones es S/ 309.90; el descuento es S/ 61.98, el envío es gratis, el IGV es S/ 44.63 y el total S/ 292.55. Un código desconocido no aplica cupón y devuelve exactamente “Cupón no válido”. Se conserva la lista permitida, la normalización existente y el contrato de resultado de `src/lib/pricing.ts`; `src/App.tsx` ya usa `applyCoupon` y mantiene el estado del cupón, y `src/components/CouponForm.tsx` ya presenta los errores/avisos. La regla comercial coincide con `README.md`; hay precedentes de estas funciones en `src/lib/pricing.test.ts` y de su interacción en `src/App.test.tsx`.

### 3. Usar el mismo neto para envío, IGV y total

El envío se calcula a partir del subtotal menos promociones y cupón. Decisión: en `src/lib/pricing.ts`, cobrar S/ 15.00 si el carrito no está vacío y ese neto es menor que S/ 150.00; cobrar S/ 0.00 si está vacío o si el neto alcanza S/ 150.00. Calcular el IGV como 18 % del neto más envío y el total como esa base más IGV. Redondear a dos decimales cada importe del desglose mediante la función `round2` existente. Por ello, neto S/ 149.99 paga S/ 15.00 de envío, neto S/ 150.00 tiene envío gratis, y carrito vacío tiene envío S/ 0.00. Con dos Mantas y `ANDES10`, el subtotal es S/ 240.00, cupón S/ 24.00, envío gratis, IGV S/ 38.88 y total S/ 254.88. Esta decisión sigue las reglas y ejemplos de `README.md`, `formatCurrency` en `src/lib/format.ts` y el contrato existente de `computeBreakdown` en `src/lib/pricing.ts`; `src/components/Summary.tsx` ya muestra las seis cantidades y representa el envío cero como “Gratis”. Los cálculos actuales de redondeo y desglose están cubiertos en `src/lib/pricing.test.ts`, y el consumo visual en `src/App.test.tsx`.

### 4. Mantener la lógica en el módulo de precios y reutilizar la interfaz existente

La propuesta afecta el precio calculado y el desglose, no introduce una pantalla o flujo nuevo. Decisión: mantener las reglas y cálculos en funciones puras de `src/lib/pricing.ts`, consumidas por la composición existente de `src/App.tsx`; conservar los contratos de `src/components/CouponForm.tsx` y `src/components/Summary.tsx` salvo que la implementación necesite conectarlos a esos resultados. No crear capas, servicios, configuración ni dependencias. Sigue la estructura de módulos descrita en `README.md`; `src/App.test.tsx` demuestra que la interfaz ya integra carrito, cupones y resumen.

## Risks / Trade-offs

- Los importes se representan como números JavaScript y los cálculos fraccionarios pueden introducir diferencias de precisión cerca de un umbral. Mitigación: centralizar el redondeo monetario en `round2` y comparar los importes monetarios calculados en la misma precisión de dos decimales, de forma coherente con los precios del catálogo y los umbrales explícitos.
- El texto del cupón proviene de entrada del cliente. Mitigación: conservar la normalización y búsqueda exclusiva en la lista fija `COUPONS` de `src/lib/pricing.ts`; para códigos no reconocidos emitir el mensaje constante especificado y no reflejar el texto arbitrario en el mensaje.
- El cálculo pertenece a una tienda local en el navegador y no existe en este cambio un servidor de pedidos o pago que valide importes. No se amplía el alcance a cobros ni a una fuente autoritativa de precios: este cambio solo corrige el desglose mostrado, conforme a `src/App.tsx` y al alcance de la propuesta. No se incorpora ni persiste información personal o de pago.

## Migration Plan

No hay migración de datos: el cambio modifica cálculos en memoria del navegador y no introduce ni cambia tablas, documentos, eventos o archivos persistidos. Desplegar la nueva versión de la aplicación; si se requiere rollback, revertir el cambio de código y volver a desplegar la versión anterior. No hay datos que restaurar o transformar.
