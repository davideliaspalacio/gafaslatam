---
name: Gafas Latam
description: "Lo que ves, grabado: una tienda clara sobre crema que abre con una toma en primera persona, el punto REC y el contador. Paleta Océano."
colors:
  night: "#101e40"
  deep: "#0a1430"
  mid: "#23365f"
  amber: "#ffb547"
  amber-deep: "#e89a2b"
  alert: "#b42318"
  cream: "#f5f1e8"
  cream-2: "#eae3d4"
  paper: "#fffcf6"
  mist: "#b9c3dc"
  ink: "#101e40"
  ink-soft: "#4a5470"
  line: "#dcd4c3"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "\"wdth\" 125"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "\"wdth\" 125"
  price:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontFeature: "\"tnum\", \"lnum\""
    fontVariation: "\"wdth\" 125"
  title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
  button:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.16em"
    fontVariation: "\"wdth\" 125"
  hand:
    fontFamily: "Yellowtail, cursive"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0"
rounded:
  pill: "9999px"
  photo: "14px"
  field: "12px"
  inset: "10px"
  focus: "4px"
  admin: "3px"
  admin-badge: "2px"
  square: "0px"
spacing:
  gap: "12px"
  gutter: "20px"
  grid-x: "20px"
  stack: "32px"
  grid-y: "40px"
  column-gap: "56px"
  section: "64px"
  section-wide: "96px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.amber-deep}"
    textColor: "{colors.night}"
  button-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-on-light:
    backgroundColor: "transparent"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-whatsapp:
    backgroundColor: "#25D366"
    textColor: "#062b16"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  whatsapp-float:
    backgroundColor: "#25D366"
    textColor: "#062b16"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "10px 16px 10px 12px"
    height: "48px"
  sticky-bar:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    padding: "12px 20px"
  rec-frame:
    backgroundColor: "{colors.deep}"
    rounded: "{rounded.photo}"
  rec-chip:
    backgroundColor: "rgb(10 20 48 / 0.7)"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  photo:
    backgroundColor: "{colors.cream-2}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.photo}"
  product-badge:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  filter-chip:
    backgroundColor: "transparent"
    textColor: "{colors.night}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  filter-chip-active:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "52px"
  option-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.photo}"
    padding: "14px 16px"
    height: "64px"
  order-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.photo}"
    padding: "20px"
  announcement:
    backgroundColor: "{colors.night}"
    textColor: "{colors.mist}"
    padding: "8px 20px"
  site-header:
    backgroundColor: "{colors.night}"
    textColor: "{colors.cream}"
    height: "64px"
  mobile-menu:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.cream}"
    rounded: "{rounded.photo}"
    padding: "8px"
    width: "240px"
  site-footer:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.mist}"
  admin-header:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
  admin-button-primary:
    backgroundColor: "{colors.night}"
    textColor: "{colors.paper}"
    rounded: "{rounded.admin}"
    padding: "0 16px"
    height: "40px"
  admin-button-primary-hover:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.paper}"
  admin-button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.admin}"
    padding: "0 16px"
    height: "40px"
  admin-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.admin}"
    padding: "8px 12px"
  admin-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
---

# Design System: Gafas Latam

## Overview

**Creative North Star: "Lo que ves, grabado"**

La tienda abre como la pantalla de una cámara puesta a la altura de los ojos: una toma real en primera persona, con el punto REC que parpadea y el contador que corre. Todo lo demás es una tienda clara sobre crema, en la paleta Océano: azul noche para la marca, el texto y las bandas que enmarcan (encabezado, portada, cierres, barra de compra), azul hondo para el pie y ámbar solo donde se compra.

La densidad es baja y pensada para el celular dentro del navegador de TikTok, Instagram o Facebook: una columna, bloques grandes, texto de 17px y objetivos táctiles de 44 a 52px. Las fotos son rectas, con esquinas de 14px; mientras no existan fotos de estudio, un espacio sobrio dice "Foto real muy pronto" en lugar de una imagen de relleno. El movimiento se reduce al REC, al contador y a transiciones de estado cortas; con reducir movimiento todo se detiene. La hoja global define además una aparición suave al entrar en pantalla que hoy ninguna superficie usa.

Rechazos confirmados: el render brillante de gafas sobre negro de las tiendas de tecnología y la plantilla de dropshipping con insignias, contadores y temporizadores; las fotos de banco y las imágenes generadas; los degradados; las itálicas gruesas; cualquier logo que no sea uno de los cuatro archivos aprobados.

**Key Characteristics:**
- Toma en primera persona a 16:9 con REC ámbar y contador como firma de la marca.
- Crema de suelo, bandas azul noche a todo el ancho, ámbar como único acento cálido.
- Títulos en Archivo expandida 800 recta; texto y botones en Instrument Sans a 17px.
- Una píldora ámbar de compra por pantalla; WhatsApp siempre a mano en su verde oficial.
- Fotos rectas con esquinas de 14px; espacios sobrios mientras no hay fotos reales.
- Plano: la profundidad sale de las bandas de color y de líneas finas, no de sombras.

## Colors

Paleta "Océano": crema de suelo, azul noche de marca y texto, ámbar como único acento cálido.

### Primary
- **Azul noche** (#101e40): el color de marca. Fondo del encabezado, la portada, las bandas de cierre, la sección de historias y la barra de compra fija del celular. Rellena el filtro activo y la insignia del modelo, marca el borde de la opción elegida y es el contorno de foco sobre crema. También es el `theme-color` del navegador.
- **Azul hondo** (#0a1430): el pie de página, el fondo de la toma REC mientras carga y el menú desplegable del celular. Al 70 % es el fondo de las pastillas REC y contador sobre la toma.
- **Azul medio** (#23365f): líneas y divisores sobre azul (franja de anuncio, franja de confianza, separadores del pie, borde del menú, borde superior de la barra fija) y el resalte de los enlaces del menú. No sirve como texto sobre azul noche (1,38:1).

### Secondary
- **Ámbar** (#ffb547): el único acento cálido. Relleno de la píldora de compra con texto azul noche (9,3:1), el precio sobre azul en la barra de compra fija, el punto REC, el subrayado a mano alzada (eco del trazo del logo) y la selección de texto.
- **Ámbar hondo** (#e89a2b): hover de la píldora de compra y anillo de foco de teclado en las muestras de color.

### Tertiary
- **Rojo aviso** (#b42318): solo errores. Borde y mensaje del campo inválido, caja de error del pedido (fondo al 5 %, borde al 40 %) y estados de fallo del panel. 5,8:1 sobre crema.

### Neutral
- **Crema** (#f5f1e8): suelo de toda la tienda y del panel.
- **Crema 2** (#eae3d4): fondo de las fotos y de sus espacios vacíos. Al 60 % forma las bandas tonales ("Así se compra", "En la caja" y "Ficha técnica") y los esqueletos de carga.
- **Papel** (#fffcf6): token derivado, no está en el brief. Campos del formulario, opciones de cantidad y de pago, resumen del pedido, tarjeta de pedido recibido, y paneles y campos del panel. Separa lo que se llena o se lee de cerca del suelo crema.
- **Bruma** (#b9c3dc): token derivado, no está en el brief. Texto secundario sobre azul (párrafo de la portada, anuncio, enlaces del menú y del pie, pies de foto, rótulos de la franja de confianza): 9,3:1 sobre azul noche. Al 45 % es el borde del botón secundario sobre azul.
- **Tinta** (#101e40): el texto sobre crema; mismo valor que azul noche, con nombre de rol.
- **Tinta suave** (#4a5470): texto secundario sobre crema (6,7:1), placeholders, respuestas de las preguntas y el rótulo del espacio de foto.
- **Línea** (#dcd4c3): bordes y divisores sobre crema: franja de confianza clara, preguntas, listas, campos y opciones sin elegir, barra de desplazamiento.

### Named Rules
**The Amber Buys Rule.** El ámbar solo aparece en la píldora de compra, el precio sobre azul, el punto REC, el subrayado a mano alzada y la selección de texto. Nunca es texto sobre crema (1,56:1) y nunca es fondo de sección ni de tarjeta.

**The Ocean Proportion Rule.** Proporción guía del brief: crema 60 %, azul 30 %, acento 10 %. El azul llega en bandas a todo el ancho (encabezado, portada, cierres, pie), no en tarjetas sueltas sobre crema.

**The Platform Green Rule.** El verde de WhatsApp (#25D366 con texto #062b16, 7,8:1) es el color oficial de la plataforma y vive como valor literal, fuera de los tokens. Solo pinta el botón flotante y la confirmación del pedido recibido; los demás enlaces a WhatsApp usan los botones secundarios o los enlaces de texto de la paleta.

## Typography

**Display Font:** Archivo expandida (eje wdth 125), con ui-sans-serif y system-ui
**Body Font:** Instrument Sans, con ui-sans-serif y system-ui
**Label/Mono Font:** Archivo expandida 700 en mayúsculas para etiquetas; Yellowtail para notas a mano

**Character:** Archivo ancha y recta da títulos de rótulo de cámara, firmes y legibles a pleno sol; Instrument Sans es la voz cercana para leer, llenar y tocar. Yellowtail pone una sola frase a mano por página, como una nota escrita en la caja.

### Hierarchy
- **Display** (Archivo 800, wdth 125, 2.5rem; 3rem desde 640px; 4rem en la portada desde 1024px; interlineado 1.02, -0.015em, líneas equilibradas): el título de cada página.
- **Headline** (Archivo 800, wdth 125, 1.75rem; 2.25rem desde 640px; 1.02): títulos de sección. Los subtítulos de "En la caja" y "Ficha técnica" bajan a 1.5rem (1.875rem desde 640px) y los de las políticas a 1.4rem (1.5rem).
- **Price** (Archivo 800, wdth 125, cifras tabulares): 2.25rem en la página del modelo, 1.75rem en la ficha destacada, 1.6rem en el total del pedido, 2rem en los números de los pasos. En la tarjeta del catálogo el precio va en Instrument Sans 600 a 17px.
- **Title** (Instrument Sans 600, 1.15rem a 1.25rem): títulos de paso, rasgos del modelo y leyendas del formulario.
- **Body** (Instrument Sans 400, 1.0625rem = 17px, interlineado 1.55): todo el texto. Párrafos largos a 36rem de ancho con interlineado 1.625. El texto secundario baja a 0.95rem.
- **Label** (Archivo 700, wdth 125, 0.72rem, 0.16em, MAYÚSCULAS, 1.3): REC, Envío / Pago / Garantía, columnas del pie, insignia del modelo, rótulo de foto. Los usos compactos (pastilla REC, insignia, franja de confianza, rótulo de foto) la bajan hoy a 0.6–0.65rem.
- **Hand** (Yellowtail 400, 1.45rem a 1.7rem, 1.1): una nota por página en azul noche al 80 %, girada -1° (-2° en la portada).
- **Button** (Instrument Sans 600, 1.0625rem): todas las píldoras de acción.

### Named Rules
**The Upright Rule.** Títulos y precios van en Archivo expandida 800 recta, y los montos con cifras tabulares. El sistema no tiene itálicas gruesas.

**The One or Two Notes Rule.** Yellowtail aparece como máximo una o dos veces por página (hoy, una), en azul noche al 80 % y con un giro de 1° a 2°. Nunca para datos, precios ni botones.

**The Label Names Data Rule.** La etiqueta en mayúsculas nombra un dato, una columna o un estado. No se usa como antetítulo encima de un título.

## Layout

Contenedor de 72rem (1152px) centrado con 20px de margen lateral; las páginas de lectura (preguntas, políticas, envíos, nosotros) se estrechan a 48rem y el pedido recibido a 42rem. Los párrafos no pasan de 36rem.

El ritmo vertical es de bandas a todo el ancho: secciones de 64px arriba y abajo en el celular y de 80 a 96px desde 768px. La portada alterna azul noche (toma y titular), crema (modelos), crema 2 al 60 % ("Así se compra"), azul noche (historias, si las hay), crema (preguntas) y azul noche (cierre), y termina en el pie azul hondo. Dentro de una banda, los bloques se separan 32px y los grupos de botones 12px.

Celular primero (412px es el lienzo de referencia): todo en una columna, con la toma REC arriba del titular y la píldora de compra a todo el ancho. Puntos de quiebre de Tailwind: 640px (los botones del héroe se ponen en fila y el catálogo pasa a dos columnas), 768px (modelo y pedido a dos columnas) y 1024px (portada a dos columnas, catálogo a tres).

- **Portada:** toma a la izquierda y texto a la derecha desde 1024px (1.25fr / 1fr, 56px entre columnas).
- **Modelo:** galería pegajosa a la izquierda y compra a la derecha desde 768px (1.1fr / 1fr, 56px); miniaturas en carrusel horizontal en el celular y en rejilla de tres desde 768px.
- **Pedido:** formulario y resumen pegajoso de 22rem desde 768px.
- **Catálogo:** 1, 2 y 3 columnas, con 20px entre columnas y 40px entre filas. Con un solo modelo, una ficha horizontal (1.15fr / 1fr) en vez de una rejilla con huecos.

El desplazamiento a anclas deja 5rem arriba. El pie reserva 112px abajo en el celular para no quedar tapado por la barra de compra y el botón de WhatsApp.

## Elevation & Depth

El sistema es plano. La profundidad sale de alternar bandas de color (azul noche, crema, crema 2 al 60 %, azul hondo) y de líneas de 1px: línea arena sobre crema, azul medio sobre azul. Fotos, tarjetas de producto, opciones y paneles no llevan sombra; solo flota lo que de verdad está encima del contenido.

### Shadow Vocabulary
- **Sombra suave** (`box-shadow: 0 1px 2px rgb(16 30 64 / 0.06), 0 8px 24px -12px rgb(16 30 64 / 0.25)`): el botón flotante de WhatsApp, el menú desplegable del celular y la tarjeta de entrada del panel. Teñida de azul noche, nunca negra.

### Named Rules
**The Flat Bands Rule.** Lo que está en la página es plano y se separa con bandas o líneas finas. La sombra suave es solo para lo que flota.

## Shapes

Dos formas mandan: el rectángulo con esquinas de 14px para todo lo que es imagen o contenedor, y la píldora para todo lo que se toca. Fotos, la toma REC, el video, el menú desplegable, el resumen del pedido, la tarjeta del pedido recibido y las opciones de cantidad y pago llevan 14px. Los campos de texto llevan 12px; los elementos internos (enlaces del menú, caja de error, barras de carga) 10px. Botones, filtros, insignias, pastillas REC y el botón de WhatsApp son píldoras; las muestras de color son círculos de 44px.

Las líneas son finas (1px). Solo lo elegible engrosa a 2px: el borde de las opciones de cantidad y pago (línea, y azul noche al elegir) y la regla superior de cada paso de "Así se compra". La cruz de las preguntas está dibujada con dos trazos de 1.5px y se vuelve menos al abrir. El contorno de foco tiene esquinas de 4px.

**The 14px Rule.** Toda foto es recta, sin marco ni giro, con esquinas de 14px sobre crema 2. Sin foto real, el mismo espacio muestra las gafas en línea y "Foto real muy pronto".

## Components

### Buttons
Píldoras grandes y francas, pensadas para el pulgar.
- **Shape:** píldora completa (9999px), 52px de alto, 28px de relleno lateral, 10px entre ícono y texto.
- **Primary (píldora de compra):** fondo ámbar, texto azul noche, Instrument Sans 600 a 17px. Lleva la acción principal de la pantalla: "Ver las gafas" en la portada y en nosotros, "Pedir · pagas al recibir" en el modelo y en el pedido, "Ir a pagar · $…" con pago en línea. Una por pantalla.
- **Hover / Focus:** hover a ámbar hondo en 200ms; al presionar baja 1px; deshabilitada queda al 80 % con un giro de carga. El foco es el contorno global de 3px a 3px de distancia, azul noche sobre crema y ámbar sobre azul.
- **Secondary sobre azul:** sin relleno, borde de bruma al 45 %, texto crema; hover con borde crema y velo crema al 5 %. Lleva "Pedir por WhatsApp" y "Escribir por WhatsApp" con el ícono oficial.
- **Secondary sobre crema:** sin relleno, borde azul noche al 25 %, texto azul noche; hover con borde azul noche y velo al 3 %. Es el "Ver el modelo" de la ficha destacada.
- **WhatsApp:** la misma píldora de 52px en verde oficial con texto verde oscuro, solo en "Confirmar ya por WhatsApp" del pedido recibido; hover oscurece al 95 %.
- **Enlaces de texto:** subrayado de 1px a 0.22em, en Instrument Sans 600 color tinta ("Ver toda la tienda", "Pregúntanos por WhatsApp", "Volver a la tienda").

### Chips
- **Filtros del catálogo:** píldoras de 44px, 0.95rem 600, borde azul noche al 20 % (al 50 % en hover). Activo: relleno azul noche y texto crema. Solo aparecen con tres modelos o más, en una fila que se desliza sin barra.
- **Insignia del modelo:** píldora azul noche con etiqueta crema, a 12px de la esquina superior izquierda de la foto.
- **Pastillas REC y contador:** píldoras azul hondo al 70 % sobre la toma; ver la toma REC.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** la tarjeta del catálogo no tiene caja: es la foto (crema 2) más una fila con nombre y precio y una línea de tipos en tinta suave. Resumen del pedido, pedido recibido y opciones van en papel.
- **Shadow Strategy:** ninguna (ver Elevation & Depth).
- **Border:** 1px línea en resumen y pedido recibido; 2px en las opciones elegibles (línea, hover tinta suave, elegida azul noche).
- **Internal Padding:** 20px en resumen y pedido recibido; 14px por 16px en las opciones, que miden al menos 64px de alto.
- **Hover de la tarjeta del catálogo:** la foto baja al 97 % de brillo y el nombre se subraya.

### Inputs / Fields
- **Style:** rótulo encima en Instrument Sans 600 a 0.95rem; campo de 52px, esquinas de 12px, borde de 1px línea, fondo papel, texto tinta a 17px y placeholder en tinta suave. La lista de departamentos usa el mismo campo con una flecha fina en tinta suave a 16px del borde.
- **Focus:** borde azul noche más un anillo de 2px azul noche al 15 %. Cursor y controles nativos (radios) en azul noche.
- **Error / Disabled:** borde rojo aviso y mensaje debajo a 0.875rem en rojo aviso; el foco salta al primer campo con error. El error general del pedido es una caja de 10px con fondo rojo al 5 % y borde al 40 %.
- **Muestras de color:** círculos de 44px con anillo de 2px en línea separado 2px sobre crema; elegida, anillo azul noche; con foco de teclado, anillo ámbar hondo.

### Navigation
- **Encabezado:** banda azul noche de 64px con el logo horizontal crema a 30px de alto. En escritorio, tres enlaces en Instrument Sans 600 a 0.95rem, bruma que pasa a crema; no hay estado activo. En el celular, "Menú" con el ícono de tres líneas abre un panel azul hondo de 240px, esquinas de 14px, borde azul medio y sombra suave, con enlaces crema de 10px de radio que se resaltan en azul medio.
- **Franja de anuncio:** opcional, encima del encabezado: texto centrado a 0.8rem 600 en bruma y línea inferior azul medio.
- **Pie:** banda azul hondo con el logo con lema en crema a 110px, columnas encabezadas por etiquetas crema y enlaces a 0.95rem en bruma que pasan a crema subrayados; cierre con línea azul medio y texto pequeño.

### Toma REC
La firma del sistema. Un cuadro 16:9 de esquinas de 14px sobre azul hondo con la toma real en primera persona (o el video de portada, sin sonido y en bucle). A 12px del borde superior: a la izquierda la pastilla "REC" con un punto ámbar de 8px que parpadea cada 1.6s (salto seco al 20 %); a la derecha el contador `00:MM:SS` en cifras tabulares a 0.72rem 600, que avanza cada segundo. Con reducir movimiento, punto y contador quedan quietos. Aparece en la portada, en nosotros y en el modelo mientras ese modelo no tenga video propio.

### Barra de compra fija
Solo en el celular. Banda azul noche con línea superior azul medio: a la izquierda el precio en ámbar (Instrument Sans 600 a 1.125rem, cifras tabulares) y "Pagas al recibir" en bruma; a la derecha la píldora ámbar "Pedir", que hoy mide 48px. Sube desde abajo en 300ms con salida exponencial solo cuando la píldora de compra del cuerpo no está a la vista, así nunca hay dos en pantalla.

### WhatsApp flotante
Abajo a la derecha, a 16px del borde más el área segura; en el modelo sube por encima de la barra de compra. Píldora de 48px en verde oficial con el ícono oficial de 24px y la palabra "WhatsApp" a 0.95rem 600, con sombra suave y un leve crecimiento (3 %) en hover. Se esconde (se desvanece y baja 12px en 300ms) mientras haya en pantalla un botón de compra o de WhatsApp de la página.

### Franja de confianza
Tres columnas (Envío, Pago, Garantía) entre líneas arriba y abajo y separadores verticales: azul medio sobre azul, línea sobre crema. Etiqueta en bruma o tinta suave y valor en Instrument Sans 600 a 0.9rem. Va bajo los botones de la portada y bajo la compra en el modelo.

### Pasos, preguntas y notas
- **Pasos:** tres columnas desde 768px, cada una con regla superior azul noche de 2px, número en Archivo 800 a 2rem, título a 1.15rem y explicación en tinta suave.
- **Preguntas:** filas desplegables de al menos 56px separadas por líneas, pregunta en 600 a 17px y cruz dibujada que se vuelve menos; respuesta en tinta suave a 36rem.
- **Subrayado ámbar:** un trazo a mano alzada de 0.32em bajo una sola palabra del título ("vives", "grabado", "tienen").
- **Historias:** solo con reseñas reales; banda azul noche, columnas con línea azul medio, estrellas ámbar (vacías en azul medio), cita a 17px y autor en bruma.

### Panel de administración
Superficie de operación: toma solo la paleta y la tipografía. Suelo crema, encabezado azul noche con "Panel" en Archivo 800 y pestañas con subrayado de 3px. Es más denso y más recto que la tienda: botones de 40px con esquinas de 3px en Instrument Sans 600 a 0.875rem (primario azul noche con texto papel y hover azul hondo; secundario papel con borde tinta al 20 %; fantasma; peligro en rojo aviso), campos de 3px con borde tinta al 20 % y foco azul noche, paneles rectos en papel con borde tinta al 10 %, e insignias de estado de 2px. Hoy el panel también usa ámbar para la pestaña activa, la insignia "nuevo", el aviso de pedidos por confirmar y la franja de la entrada; eso queda fuera de The Amber Buys Rule y está pendiente de decisión.

## Do's and Don'ts

### Do:
- **Do:** Usa crema (#f5f1e8) como suelo y bandas azul noche (#101e40) a todo el ancho para encabezado, portada, cierres y barra de compra; el pie va en azul hondo (#0a1430).
- **Do:** Pon una sola píldora ámbar de compra por pantalla: 52px, texto azul noche, Instrument Sans 600 a 17px.
- **Do:** Pon el precio en ámbar solo sobre azul; sobre crema va en tinta y con cifras tabulares.
- **Do:** Muestra toda foto recta con esquinas de 14px sobre crema 2; sin foto real, deja el espacio sobrio "Foto real muy pronto".
- **Do:** Usa la toma REC (16:9, punto ámbar, contador) para la prueba en primera persona, con la toma real o un video real.
- **Do:** Usa el logo de `public/brand/`: la versión crema sobre azul y la azul sobre crema, a su proporción.
- **Do:** Mantén Instrument Sans como voz de texto y botones, y el fondo crema, aunque un detector mecánico los marque como "sobreusada" o "fondo crema": los fija el brief de marca.
- **Do:** Mantén los objetivos táctiles en 44px o más; campos del pedido y píldoras de compra en 52px.
- **Do:** Usa bruma (#b9c3dc) para el texto secundario sobre azul y tinta suave (#4a5470) sobre crema.
- **Do:** Detén el REC, el contador y el desplazamiento suave cuando el sistema pide reducir movimiento.

### Don't:
- **Don't:** Pongas ámbar como texto sobre crema ni como fondo de sección o de tarjeta.
- **Don't:** Uses el verde de WhatsApp fuera de las acciones de WhatsApp.
- **Don't:** Redibujes, estires, recolores ni compongas el logo en texto.
- **Don't:** Uses fotos de banco, imágenes generadas ni renders brillantes sobre negro.
- **Don't:** Agregues degradados ni itálicas gruesas.
- **Don't:** Pongas más de una o dos notas en Yellowtail por página, ni la uses para datos, precios o botones.
- **Don't:** Uses la etiqueta en mayúsculas como antetítulo encima de un título.
- **Don't:** Pongas sombra a fotos, tarjetas, opciones o paneles; la sombra suave es solo para lo que flota.
- **Don't:** Conviertas la tienda en una plantilla de dropshipping con insignias, contadores de ventas, temporizadores o "personas viendo esto".
- **Don't:** Introduzcas colores fuera de los tokens (por ejemplo, la paleta por defecto de Tailwind).
