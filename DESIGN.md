---
name: gafasLatam
description: "Rollo de revelado: la tienda es el sobre del laboratorio de fotos, sobre el cartón verde de una cámara desechable."
colors:
  carton: "#0c7038"
  carton-deep: "#08532a"
  carton-night: "#05321a"
  carton-soft: "#cfe6d6"
  flash: "#f5c518"
  flash-deep: "#e2b100"
  stamp: "#ff6b1a"
  paper: "#fbfbf7"
  paper-shade: "#eef1ec"
  ink: "#111611"
  ink-soft: "#4a5a4f"
  rule: "#d6ded8"
  alert: "#c8261d"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.15rem"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 125"
  numeral:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\", \"lnum\""
    fontVariation: "\"wdth\" 125"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
    fontFeature: "\"lnum\""
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.04em"
    fontVariation: "\"wdth\" 75"
  button:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    letterSpacing: "0.04em"
    fontVariation: "\"wdth\" 75"
rounded:
  square: "0px"
  badge: "2px"
  button: "3px"
  round: "9999px"
spacing:
  print-mat: "0.55rem"
  field-gap: "12px"
  gutter: "16px"
  envelope-pad: "20px"
  gutter-wide: "24px"
  envelope-pad-wide: "28px"
  section: "64px"
  section-wide: "96px"
components:
  button-primary:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.flash-deep}"
    textColor: "{colors.ink}"
  button-sticky:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "48px"
  announcement-strip:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 16px"
  print:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "{spacing.print-mat}"
  envelope:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  envelope-band:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.ink}"
    padding: "4px 20px 12px"
  saving-stamp:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "2px 8px"
  envelope-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px 12px 0"
  option-tile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "14px 16px"
  sticky-bar:
    backgroundColor: "{colors.carton-night}"
    textColor: "{colors.paper}"
    padding: "12px 16px"
  admin-header:
    backgroundColor: "{colors.carton}"
    textColor: "{colors.paper}"
  admin-button-primary:
    backgroundColor: "{colors.carton}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "40px"
  admin-button-primary-hover:
    backgroundColor: "{colors.carton-deep}"
    textColor: "{colors.paper}"
  admin-button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "40px"
  admin-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "8px 12px"
  admin-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
---

# Design System: gafasLatam

## Overview

**Creative North Star: "Rollo de revelado"**

La tienda es el sobre que recoges en el laboratorio de fotos. El suelo es el cartón verde de una cámara desechable; encima descansan copias fotográficas en papel blanco con borde, un poco giradas y con la fecha estampada en naranja; la acción es el amarillo del flash. El cliente no recorre una plantilla de tienda: mira copias de lo que se ve con las gafas, llena el sobre de pedido y recibe la copia de su pedido fechada hoy. Todo lo que aparece en pantalla es un objeto de ese mundo: cartón, copia, sobre, talón, sello de fecha.

La densidad es de empaque, no de catálogo: bandas de color a sangre completa que se alternan (cartón, cartón profundo, papel, cartón noche), una sola columna en el celular y dos en escritorio. La rotulación es una grotesca ancha, pesada e itálica, como el logo impreso en una caja; el cuerpo es la misma familia en ancho normal y los rótulos pequeños la condensan como la letra menuda del costado del cartón. El movimiento también pertenece al mundo: las copias se revelan al entrar en pantalla y un único destello de flash confirma el pedido.

El panel de administración (superficie de operación) toma prestados solo la tipografía, la paleta y la densidad: cabecera de cartón, suelo papel sombreado, paneles de papel con filete, sin copias giradas ni sobres. Rechazos confirmados: nada de landing tecnológica oscura con render brillante, nada de plantilla blanca de dropshipping con insignias y contadores.

**Key Characteristics:**
- Cartón verde como suelo dominante; papel blanco solo como objeto (copia, sobre) o como el panel blanco del costado de la caja.
- Copias fotográficas en lugar de tarjetas: marco de papel, sombra verde, inclinación de pocos grados.
- Amarillo flash reservado a la acción y a muy pocos rellenos con nombre.
- Naranja de estampa solo en fechas de siete segmentos.
- Una sola familia (Archivo variable) con tres voces sacadas de sus ejes.
- Honestidad visible: toda foto de muestra lleva impreso "Foto de referencia"; sin reseñas, contadores ni urgencia inventados.

## Colors

Cartón verde saturado y sus tres tonos, papel blanco cálido, tinta negra verdosa y dos acentos de función estricta: amarillo flash y naranja de estampa.

### Primary
- **Cartón de cámara** (#0c7038): suelo de la página (`body`), primera pantalla, sobre de pedido y reseñas. También es el color de los títulos sobre papel, del anillo de foco sobre papel, del cursor y de los controles nativos (`caret-color`, `accent-color`), del estado seleccionado de las opciones del sobre y del botón primario del panel. `themeColor` del navegador.
- **Cartón profundo** (#08532a): segunda banda (copias en primera persona, preguntas), hover del botón primario del panel y tinta del rótulo "Sobre de pedido" sobre la banda amarilla.
- **Cartón noche** (#05321a): pie de página, barra fija de compra (al 95 % con desenfoque), cabecera de la copia del pedido y fondo de las copias mientras carga la foto.
- **Cartón claro** (#cfe6d6): texto secundario sobre cartón (4,7:1 sobre cartón medio), filetes translúcidos sobre cartón (al 25 %) y barras de desplazamiento.

### Secondary
- **Amarillo flash** (#f5c518): la acción. Como relleno, con tinta negra encima (11,2:1): botón de pedir, sello de ahorro de "Doble copia", franja de anuncio superior y banda de cabecera del sobre. Como tinta, solo sobre cartón: la segunda línea del titular principal, trazos e iconos (signo de las preguntas, icono de WhatsApp, estrellas de reseñas reales), el anillo de foco y la selección de texto. En el panel marca lo que espera al operador: la pestaña activa, el estado "Nuevo" y el aviso de pedidos por confirmar.
- **Flash apagado** (#e2b100): hover de todo relleno amarillo y borde del selector de estado "Nuevo".

### Tertiary
- **Naranja de estampa** (#ff6b1a): exclusivo de la fecha de siete segmentos (`DateStamp`), con un halo naranja que imita el LED de la cámara. Nunca en texto, iconos, precios ni avisos.

### Neutral
- **Papel fotográfico** (#fbfbf7): copias, sobre, panel blanco del costado de la caja (funciones, ficha, compra), políticas y paneles del panel.
- **Papel sombreado** (#eef1ec): suelo del panel de administración y la solapa triangular del sobre.
- **Tinta** (#111611): texto principal sobre papel y sobre amarillo; borde doble de la ficha técnica.
- **Tinta suave** (#4a5a4f): cuerpo secundario sobre papel (7,1:1), rótulos de casillas, pie de "Foto de referencia".
- **Filete** (#d6ded8): divisores sobre papel, borde de opciones sin seleccionar, línea punteada del talón.
- **Alerta** (#c8261d): errores de campo, aviso de error del formulario (borde al 40 %, fondo al 6 %), estado "Devuelto" y botón de peligro del panel. El éxito usa cartón, no un verde aparte.

### Named Rules
**The Flash Is Action Rule.** El relleno amarillo solo aparece en la acción primaria, el sello de ahorro de "Doble copia", la franja de anuncio y la banda del sobre. Nunca es fondo de sección ni bloque decorativo grande.

**The Flash-On-Carton Rule.** Como tinta, el amarillo vive sobre cartón y en tamaño display, trazos o iconos (3,8:1 sobre cartón medio). Sobre papel no se usa como tinta (1,6:1). Los rótulos pequeños en amarillo solo van sobre cartón profundo o noche (5,6:1 o más).

**The Dates Only Rule.** El naranja de estampa es una fecha o no es nada: solo dentro del sello de siete segmentos, en formato de cámara (`'AA M D`), en hora de Bogotá.

## Typography

**Display Font:** Archivo variable, itálica, eje `wdth` 125 (con ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo variable, redonda, ancho normal (misma pila)
**Label/Mono Font:** Archivo variable condensada, eje `wdth` 75, versalitas por `text-transform: uppercase`

**Character:** Una sola familia con tres voces. La rotulación de cartón (itálica, 850, ancho 125) suena a logo de caja de cámara; el rótulo de especificaciones (600, ancho 75, mayúsculas espaciadas) suena a letra menuda impresa en el costado; el cuerpo en ancho normal se lee tranquilo al sol. Todas las cifras son de caja alta (`lining-nums`) y las tablas, precios y talones usan cifras tabulares.

### Hierarchy
- **Display** (850 itálica, ancho 125, 2.15rem en celular, 3.75rem desde 640px, 4.1rem desde 768px, interlineado 0.95, -0.02em): titular de la primera pantalla, partido en dos líneas por el primer punto; la segunda línea va en amarillo flash.
- **Headline** (850 itálica, ancho 125, 2rem en celular, 3rem desde 640px): títulos de banda ("Así se ve lo que grabas", "Llena el sobre", "Preguntas en el mostrador"). Variantes de la misma voz: títulos del costado de la caja a 1.8rem / 2.25rem, titular de confirmación a 2.4rem / 3rem, título de política a 2.2rem / 3rem, marca de la cabecera a 1.9rem y del pie a 1.875rem, "Pedido #N" a 3rem.
- **Numeral** (rotulación de cartón **derecha**, 850, ancho 125, cifras tabulares, 2.4rem): precio de la primera pantalla; el total del talón usa la misma voz a 1.5rem.
- **Title** (700, 1.25rem en celular y 1.5rem desde 640px, -0.025em): nombre de cada función; los pasos de "Cómo compras" y los subtítulos de política a 1.125–1.25rem.
- **Body** (400, 1–1.06rem, interlineado 1.625): párrafos con medida máxima de 65ch (`max-w-prose`); políticas a 68ch. Sobre cartón en cartón claro; sobre papel en tinta suave.
- **Label** (600, ancho 75, 0.62–0.82rem, +0.04em, MAYÚSCULAS): rótulos de casillas del sobre (0.68rem), leyendas de fieldset (0.75rem), resumen de entrega/pago/garantía, encabezados del pie, "Foto de referencia" (0.62rem). La misma voz a 1.05rem es el texto de los botones amarillos.

### Named Rules
**The One Family Rule.** No se agrega otra familia. Las tres voces salen de los ejes de Archivo (ancho 75 / normal / 125, redonda e itálica).

**The Upright Numerals Rule.** Los precios y totales usan la rotulación de cartón pero en redonda, con cifras tabulares. La itálica ancha es para palabras, no para montos.

**The Carton Is Not Prose Rule.** La rotulación de cartón nunca compone párrafos ni textos de más de dos líneas cortas; el cuerpo siempre es Archivo de ancho normal.

## Layout

Diseño pensado primero para el celular (390px de ancho de referencia), con contenedor centrado de 72rem (1152px), márgenes laterales de 16px y de 24px desde 640px. Puntos de quiebre de Tailwind: 640px, 768px y 1024px.

La página se arma con **bandas de color a sangre completa**, no con tarjetas: cartón (primera pantalla, sobre, reseñas) → cartón profundo (copias en primera persona, preguntas) → papel (funciones; costado de la caja con ficha, contenido y compra) → cartón noche (pie). Ritmo vertical de banda: 56–64px en celular y 80–96px desde 768px.

- **Primera pantalla:** una columna en celular (pila de copias al 80 % del ancho, luego titular, precio, botón y resumen de tres columnas). Desde 768px, dos columnas `1.1fr / 1fr` con las copias a la izquierda y el texto a la derecha, centradas verticalmente.
- **Copias en primera persona:** carrusel horizontal con snap en celular (cada copia al 72 %, 44 % desde 640px, sin barra de desplazamiento); cuadrícula de tres columnas desde 768px.
- **Funciones:** `1fr / 0.8fr` desde 768px, con la pila de copias fija (`sticky`) a la derecha.
- **Costado de la caja:** 1 columna, 2 desde 768px, 3 desde 1024px. La ficha técnica solo ocupa columna si `specs_confirmed` es verdadero.
- **Sobre de pedido:** una columna de 36rem (576px), casillas separadas 12px; departamento y ciudad a dos columnas desde 640px.
- **Confirmación de pedido:** columna de 36rem, copia del pedido y pasos debajo.
- **Barra fija de compra:** solo bajo 768px; aparece cuando el botón principal sale de pantalla y se esconde cuando el sobre está visible. Respeta `safe-area-inset-bottom`.
- `scroll-padding-top` de 4.5rem para que los saltos a `#pedido` no queden pegados al borde.
- **Panel:** mismo contenedor de 72rem con 32px arriba y abajo; resumen en 2 / 3 / 6 columnas; "Últimos pedidos" y "Campañas" en `1.2fr / 1fr` desde 1024px; tablas con ancho mínimo de 760px y desplazamiento horizontal.

## Elevation & Depth

La profundidad es física: los objetos de papel descansan sobre el cartón y proyectan una sombra **verde** (rgb(8 49 26)), nunca negra. Las copias se giran entre -4° y 6° y se apilan de a dos para parecer dejadas sobre el mostrador. El panel de administración es plano: separa con filetes (tinta al 10 %) y no usa sombras, salvo la tarjeta de ingreso, que es un sobre.

### Shadow Vocabulary
- **Sombra de copia** (`box-shadow: 0 1px 1px rgb(8 49 26 / 0.18), 0 10px 24px -6px rgb(8 49 26 / 0.45), 0 28px 48px -18px rgb(8 49 26 / 0.5)`): copias, sobre de pedido, copia del pedido, tarjeta de ingreso al panel.
- **Sombra de realce** (`box-shadow: 0 2px 2px rgb(8 49 26 / 0.12), 0 14px 30px -12px rgb(8 49 26 / 0.35)`): botones amarillos principales y sello de ahorro.
- **Halo de estampa** (`filter: drop-shadow(0 0 1.5px rgb(255 107 26 / 0.85)) drop-shadow(0 0 5px rgb(255 120 40 / 0.45))`): solo en la fecha de siete segmentos.

### Named Rules
**The Print Shadow Rule.** Solo proyecta sombra lo que es papel o lo que es la acción amarilla. Todo lo demás es plano sobre su banda.

**The Small Tilt Rule.** La inclinación es de pocos grados (copias de -4° a 6°; serie de momentos -2°, 1.5°, -1°, 2°, -1.5°, 1°; copia del pedido -1°; sello de ahorro -2°). Nada se gira por encima de 6°.

## Shapes

El papel es cuadrado. Copias, sobre, casillas, opciones del sobre, paneles y bandas tienen esquinas a 0. Solo los botones y los selectores del panel llevan una esquina apenas suavizada (3px); las insignias de estado del panel, 2px. Los únicos círculos son las muestras de color (44px) y los botones de icono (44px en la cabecera, 36px en el panel).

Formas propias del mundo: la solapa triangular del sobre (recorte `polygon(0 0, 100% 0, 50% 100%)` en papel sombreado sobre la banda amarilla), la línea punteada de 2px del talón con unas tijeras encima, el borde doble de 2px en tinta de la ficha técnica y el signo más dibujado con dos trazos amarillos de 2px que se vuelve menos al abrir. Los divisores son filetes de 1px; las opciones seleccionables usan borde de 2px.

## Components

### Buttons
Botón de pedir: ancho, alto y amarillo, como la etiqueta de oferta de la caja.
- **Shape:** esquina apenas suavizada (3px).
- **Primary:** relleno amarillo flash con tinta negra, rótulo condensado en mayúsculas a 1.05rem, alto mínimo 56px, 24px a los lados, sombra de realce. En celular ocupa todo el ancho; en escritorio, máximo 28rem.
- **Hover / Focus:** pasa a flash apagado en 200ms; al presionar baja 1px. Foco: contorno amarillo de 3px separado 3px sobre cartón; contorno cartón dentro de superficies `.on-paper`.
- **Pendiente:** opacidad 80 %, cursor de progreso, icono giratorio y texto "Registrando pedido…".
- **Barra fija:** misma piel a 48px de alto, 0.95rem, sin sombra.
- **Panel:** primario cartón con texto papel (40px, 0.875rem semibold), hover cartón profundo; secundario papel con borde de tinta al 20 % (al 40 % en hover); fantasma en tinta suave; peligro con borde y texto de alerta.

### Print (copia fotográfica)
El componente firma: reemplaza a la tarjeta.
- **Estructura:** marco de papel de 0.55rem, foto con recorte 4:5 (por defecto), 5:4 o cuadrado sobre fondo cartón noche, sombra de copia, giro por `rotate`.
- **Fecha:** sello de siete segmentos abajo a la derecha (6 % del borde, 7 % del alto de la foto).
- **Referencia:** si la imagen es de muestra o de banco, el margen inferior lleva impreso "Foto de referencia" (rótulo de 0.62rem en tinta suave). Es obligatorio, no decorativo.
- **Revelado:** con `animation-timeline: view()` la foto entra subexpuesta (`brightness(0.55) saturate(0.2) sepia(0.35) contrast(0.9)`) y llega a su color entre la entrada y el 35 % de cobertura. Desactivado con `prefers-reduced-motion`.

### Date Stamp (fecha estampada)
Dígitos de siete segmentos dibujados en SVG, inclinados -8°, en naranja de estampa con halo. Acepta dígitos, espacios y apóstrofo (`'26 10 18`). Aparece en copias, en la cabecera de la copia del pedido y, al 60 %, como `'00 00 00` en el estado vacío de pedidos del panel.

### Order Envelope (sobre de pedido)
El formulario de compra es el sobre del laboratorio.
- **Cabecera:** solapa triangular sobre banda amarilla de 28px, luego la marca en rotulación de cartón (1.25rem) y el rótulo "Sobre de pedido" en cartón profundo.
- **Opciones de cantidad y pago:** baldosas cuadradas con borde de 2px en filete; hover a tinta suave; seleccionada con borde cartón y fondo cartón al 6 %. Radio nativo de 20px teñido de cartón. El precio va en cifras tabulares a 1.125rem.
- **Sello de ahorro:** etiqueta amarilla girada -2° que sobresale 12px del borde superior de la opción "Doble copia", con sombra de realce y el ahorro calculado ("Ahorras $…").
- **Color:** muestras circulares de 44px con anillo de 2px en filete, cartón al seleccionar, amarillo al recibir foco.
- **Talón:** separado por línea punteada con tijeras; resumen línea por línea con cifras tabulares; total en numeral de cartón a 1.5rem; aviso de error en caja de alerta; botón amarillo de ancho completo con el total.
- **Confirmación:** al registrar el pedido, un único destello blanco a pantalla completa (700ms) antes de ir a la copia del pedido.

### Inputs / Fields
- **Sobre:** casilla impresa cuadrada, borde de 1px en tinta al 30 %, con el rótulo condensado (0.68rem) dentro de la casilla y el valor a 1.06rem debajo. "(opcional)" en minúscula sin espaciado.
- **Focus:** el borde pasa a cartón con anillo cartón al 15 %.
- **Error:** borde de alerta y mensaje de alerta a 0.875rem debajo; el primer campo con error recibe el foco.
- **Panel:** esquina de 3px, borde de tinta al 20 %, fondo papel, 8px × 12px, 0.95rem; foco con borde cartón y anillo cartón al 20 %. Rótulo encima en 0.8rem semibold tinta suave.

### Navigation
- **Franja de anuncio:** amarillo a todo el ancho, rótulo condensado de 0.8rem centrado, tinta negra. Solo si hay anuncio cargado.
- **Cabecera de tienda:** marca "gafasLatam" en rotulación de cartón papel (1.9rem); enlace "Hacer pedido" condensado en cartón claro (papel en hover), oculto en celular; botón circular de WhatsApp de 44px que se oscurece a cartón profundo en hover.
- **Pie:** cartón noche, marca, columnas "Ayuda" y "Legal" con encabezado condensado en papel y enlaces en cartón claro (papel y subrayado en hover).
- **Pestañas del panel:** sobre la cabecera cartón; texto semibold 0.875rem en cartón claro con línea inferior de 3px transparente; la activa pasa a papel con línea amarilla. Desplazamiento horizontal sin barra en celular.
- **Filtros de pedidos:** enlaces de 3px; el activo con relleno cartón y texto papel.

### Cards / Containers
- **Tienda:** no hay tarjetas. Los contenidos se agrupan como filas de definición sobre papel (filete superior de 1px y 28px de aire), listas con check cartón, o la copia y el sobre.
- **Panel:** `Panel` de papel con borde de tinta al 10 %, esquina 0, título opcional de 0.875rem en negrita separado por filete. Filas con hover de tinta al 2–3 %.

### Status Badges (panel)
Insignias de 2px, 0.75rem semibold: "Nuevo" amarillo con tinta; "Confirmado" cartón al 12 % con cartón profundo; "Entregado" cartón con papel; "Cancelado" tinta al 8 % con tinta suave; "Devuelto" alerta al 10 % con alerta. El selector rápido de estado repite los mismos tonos con borde.

### Data and Lists
- **Ficha técnica:** solo se muestra cuando el producto tiene `specs_confirmed`. Borde superior e inferior de 2px en tinta, filas separadas por filete, rótulo condensado a la izquierda y valor en negrita sin cortes a la derecha, cifras tabulares.
- **Preguntas:** `details` con filetes de cartón claro al 25 %, pregunta en 1.05rem semibold papel, signo más amarillo dibujado en CSS.
- **Reseñas:** solo con reseñas reales cargadas desde el panel; estrellas rellenas en amarillo, cita en papel, autor y ciudad en rótulo condensado.
- **Iconos:** trazo de Lucide (16–24px; grosor 1.5 a 2.25) y el logotipo de WhatsApp en SVG en línea, siempre con `aria-hidden` o etiqueta.

## Do's and Don'ts

### Do:
- **Do:** Usa el cartón (#0c7038) como suelo dominante y separa capítulos con bandas a sangre completa de cartón profundo, papel o cartón noche.
- **Do:** Presenta toda fotografía como copia: marco de papel de 0.55rem, sombra de copia verde, giro entre -4° y 6°.
- **Do:** Imprime "Foto de referencia" en el margen de toda foto de muestra o de banco (prop `reference` de `Print`) hasta que existan fotos reales.
- **Do:** Pon tinta negra (#111611) sobre todo relleno amarillo, nunca blanco.
- **Do:** Fecha las copias con el sello de siete segmentos en formato de cámara (`'AA M D`), en hora de Bogotá.
- **Do:** Marca con `.on-paper` toda superficie de papel para que el contorno de foco pase de amarillo a cartón.
- **Do:** Compón precios y totales en rotulación de cartón redonda con cifras tabulares.
- **Do:** Mantén los objetivos táctiles en 44px o más y el botón de pedir en 56px.

### Don't:
- **Don't:** Uses el amarillo flash como campo decorativo grande: nada de fondos de sección, bloques ni tarjetas amarillas.
- **Don't:** Uses el naranja de estampa fuera del sello de fecha: ni texto, ni precios, ni descuentos, ni avisos.
- **Don't:** Pongas tinta amarilla sobre papel ni rótulos pequeños amarillos sobre cartón medio.
- **Don't:** Inventes prueba social: nada de reseñas falsas, contadores de ventas, "personas viendo esto", cuentas regresivas ni stock inventado.
- **Don't:** Muestres la ficha técnica mientras `specs_confirmed` sea falso.
- **Don't:** Uses tarjetas redondeadas con sombra genérica en la tienda: el papel es cuadrado y solo los botones llevan 3px.
- **Don't:** Uses sombras negras neutras; la sombra del sistema es verde cartón.
- **Don't:** Agregues otra familia tipográfica ni compongas párrafos en la rotulación de cartón.
- **Don't:** Introduzcas colores fuera de los tokens (por ejemplo, la paleta por defecto de Tailwind).
- **Don't:** Conviertas la tienda en una landing tecnológica oscura con render brillante ni en una plantilla blanca de dropshipping con insignias y contadores.
