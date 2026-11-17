## Why
IP-734 informa que los clientes ven promociones y cupones en el resumen del carrito, pero no se descuentan correctamente del importe por pagar. El carrito debe calcular los descuentos 3x2, la elegibilidad y el importe de los cupones, el envío, el IGV y el total de acuerdo con las reglas de precio documentadas para Tienda Andes.

## What Changes
- Corregir los descuentos 3x2 para cada grupo completo de tres unidades de cada producto elegible.
- Calcular la elegibilidad y los descuentos de cupones sobre el subtotal de todo el carrito después de las promociones, y reflejar el descuento en el envío, el IGV y el total.
- Aplicar al desglose de precios el umbral de envío, la excepción del carrito vacío y el cálculo documentado del IGV.

## Capabilities
### New Capabilities
- `precios-carrito`: Define los cálculos de promociones, cupones, envío, IGV y total que se muestran en el carrito.

### Modified Capabilities
- None.

## Impact
El cambio afecta el comportamiento de precios del carrito representado en `src/lib/pricing.ts`, su uso en `src/App.tsx` y el desglose y aviso de cupón que muestra la interfaz. No cambia el catálogo de productos, los nombres o tasas de los cupones ni las reglas de precio documentadas. Supuesto: todos los importes mostrados usan la convención monetaria existente de dos decimales, y las reglas de precio del README completan los ejemplos del ticket, incluido el comportamiento cuando un cupón aplicado deja de cumplir el mínimo y la excepción de envío del carrito vacío. No se incluyen cambios de API, persistencia ni dependencias.
