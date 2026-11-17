## ADDED Requirements

### Requirement: Descuento de promociones 3x2
El carrito SHALL descontar el precio de una unidad por cada grupo completo de tres unidades del mismo producto elegible, de manera independiente para Chullo tejido y Miel de abeja 350 g.

#### Scenario: IP-734 aplica 3x2 a tres Chullos
- **GIVEN** el carrito contiene 3 Chullo tejido a S/ 45.00 cada uno
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el subtotal es S/ 135.00, las promociones son − S/ 45.00, el envío es S/ 15.00, el IGV es S/ 18.90 y el total es S/ 123.90

#### Scenario: IP-734 descuenta cada grupo completo de tres
- **GIVEN** el carrito contiene 6 Chullo tejido a S/ 45.00 cada uno
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** las promociones son − S/ 90.00

#### Scenario: IP-734 aplica promociones por separado a ambos productos elegibles
- **GIVEN** el carrito contiene 3 Chullo tejido y 3 Miel de abeja 350 g
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** las promociones suman − S/ 63.90, con una unidad descontada de cada producto

#### Scenario: IP-734 no combina productos distintos en un grupo promocional
- **GIVEN** el carrito contiene 2 Chullo tejido y 1 Miel de abeja 350 g
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** las promociones son S/ 0.00

### Requirement: Cálculo y vigencia de cupones
El carrito SHALL calcular el cupón sobre el subtotal restante después de las promociones y SHALL comparar el mínimo de BIENVENIDA20 con ese mismo importe después de promociones de todo el carrito. ANDES10 no tiene mínimo; un código de cupón desconocido SHALL rechazarse con “Cupón no válido”.

#### Scenario: IP-734 incluye ANDES10 en el importe final
- **GIVEN** el carrito contiene 2 Manta andinas a S/ 120.00 cada una y se aplicó ANDES10
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el subtotal es S/ 240.00, el descuento del cupón es S/ 24.00, el envío es gratis, el IGV es S/ 38.88 y el total es S/ 254.88

#### Scenario: IP-734 acepta BIENVENIDA20 cuando todo el carrito cumple el mínimo
- **GIVEN** el carrito contiene 1 Poncho de alpaca a S/ 189.90 y 1 Manta andina a S/ 120.00, y se aplicó BIENVENIDA20
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el cupón se acepta porque el importe del carrito después de promociones es S/ 309.90, su descuento es S/ 61.98, el envío es gratis, el IGV es S/ 44.63 y el total es S/ 292.55

#### Scenario: IP-734 acepta BIENVENIDA20 en el mínimo
- **GIVEN** se aplicó BIENVENIDA20 y el importe del carrito después de promociones es exactamente S/ 200.00
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el descuento del cupón es S/ 40.00 y no se muestra el aviso del mínimo

#### Scenario: IP-734 rechaza BIENVENIDA20 por debajo del mínimo
- **GIVEN** se aplicó BIENVENIDA20 y el importe del carrito después de promociones es S/ 199.99
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el descuento del cupón es S/ 0.00 y el aviso es “El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00”

#### Scenario: IP-734 quita el descuento cuando un cupón aplicado deja de cumplir el mínimo
- **GIVEN** se aplicó BIENVENIDA20 a un carrito con 2 Manta andinas a S/ 120.00 cada una
- **WHEN** se quita una Manta andina del carrito
- **THEN** el descuento del cupón pasa a S/ 0.00 y el carrito muestra “El cupón BIENVENIDA20 requiere una compra mínima de S/ 200.00”

#### Scenario: IP-734 rechaza un cupón desconocido
- **GIVEN** el carrito contiene 2 Manta andinas y no hay un cupón reconocido aplicado
- **WHEN** el cliente aplica el código “NOEXISTE”
- **THEN** el cupón no se aplica y el mensaje es “Cupón no válido”

### Requirement: Envío e IGV del carrito
El carrito SHALL cobrar S/ 15.00 de envío cuando no esté vacío y su importe después de promociones y cupón sea menor que S/ 150.00; el envío SHALL ser gratis desde S/ 150.00 y S/ 0.00 cuando esté vacío. El carrito SHALL calcular el IGV del 18 % sobre el importe después de promociones y cupón más el envío, y calcular el total como esa base más el IGV; cada importe mostrado SHALL redondearse a dos decimales.

#### Scenario: IP-734 cobra envío por debajo del umbral
- **GIVEN** el carrito no está vacío y su importe después de promociones y cupón es S/ 149.99
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el envío es S/ 15.00

#### Scenario: IP-734 da envío gratis en el umbral
- **GIVEN** el carrito no está vacío y su importe después de promociones y cupón es S/ 150.00
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el envío es gratis

#### Scenario: IP-734 no cobra envío por un carrito vacío
- **GIVEN** el carrito no tiene productos
- **WHEN** se calcula el desglose de precios del carrito
- **THEN** el envío es S/ 0.00

#### Scenario: IP-734 redondea a dos decimales cada importe mostrado
- **GIVEN** el cálculo de precios del carrito produce un importe con más de dos decimales
- **WHEN** se muestra el desglose de precios del carrito
- **THEN** cada importe mostrado se redondea a dos decimales
