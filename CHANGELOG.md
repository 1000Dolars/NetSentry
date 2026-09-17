# Historial de cambios

## [Sin publicar] — 2026-09-17

Cambios del repositorio, no de la extensión: la versión sigue siendo 1.4.1 y
`manifest.json` no se toca.

- El proyecto entero pasa a estar en GitHub. Hasta ahora solo se había subido
  `PRIVACY.md` a mano desde la web.
- La extensión ya está publicada en la Chrome Web Store, así que el README y
  la página enlazan a la ficha y la instalación en modo desarrollador deja de
  ser la vía principal: pasa a ser la de quien quiera tocar el código.
- Nueva página de presentación en `index.html`, publicada con GitHub Pages.
  Lleva dentro una demo funcional: en vez de capturas de pantalla, carga
  `data.js`, `render.js` y `styles.css` —los archivos reales— dentro de un
  Shadow DOM propio, con la misma técnica que usa `content.js` en la página
  anfitriona. Las cifras y la matriz de riesgo se calculan desde
  `window.PDD_DATA`, así que no hay contenido duplicado que mantener al día.
- El README documentaba un `.zip` que no estaba en el repositorio. Ahora
  `.gitignore` excluye `*.zip` explícitamente —es un artefacto, no código— y
  el README explica qué tiene que llevar dentro al regenerarlo.

## [1.4.1] — 2026-09-15

Arreglo: el widget flotante no aparecía en ninguna plataforma.

- `manifest.json` no declaraba `web_accessible_resources`, así que el
  `fetch` de `styles.css` que hace el content script para inyectar el CSS
  en su Shadow DOM no tenía permiso para leer el archivo. Como todo el
  posicionamiento del widget vive en esa hoja (`:host` con `position:
  fixed`, y `:host(.pdd-cerrado)` para el estado plegado), el widget se
  construía igual pero sin posición ni panel oculto: quedaba como un bloque
  suelto al final del documento en vez de una burbuja flotante. Ahora
  `styles.css` se declara accesible, restringido a los mismos 23 dominios
  que ya usan `host_permissions` y `content_scripts`.
- Si aun así la hoja no carga, el widget ya no se dibuja a medias: se
  retira. El caso típico es recargar la extensión con pestañas abiertas —
  el content script viejo queda huérfano y `chrome.runtime.getURL()`
  devuelve `chrome-extension://invalid/`. Antes eso dejaba un bloque de
  texto sin estilos al pie de la página; ahora no deja nada y basta con
  recargar la pestaña.

## [1.4.0] — 2026-09-15

- Los iconos de `icons/` (16/48/128 px, los que usa Chrome en la barra y en
  `chrome://extensions`) pasaron del círculo plano original al mismo diseño
  premium del logo — squircle, degradado y sombra suave —, exportados desde
  `logo/logo.svg` a esos tres tamaños exactos. Reemplaza la decisión de la
  versión anterior de dejarlos "simples"; probados y legibles incluso a
  16 px.
- Primer paquete `.zip` listo para subir a la Chrome Web Store (ver
  [README.md](README.md) → "Publicar en la Chrome Web Store").

## [1.3.0] — 2026-09-15

- Nuevo logo de marca en `logo/` (`logo.svg` + exportados PNG a 512 y
  1024 px): squircle con degradado, brillo superior y sombra suave, en la
  línea de los iconos de app de Apple. Es la imagen para la ficha de la
  Chrome Web Store, el README y material de promoción — **no** reemplaza
  a los iconos simples de `icons/`, que se quedan como están porque tienen
  que verse bien a 16 px en la barra de Chrome.
- El README ahora muestra el logo en la cabecera.

## [1.2.0] — 2026-09-12

Pasada de rediseño visual, sin cambios de funcionalidad ni de permisos.

- Cabecera con degradado de marca (antes rojo plano) e icono de escudo
  junto al título.
- El nombre de la plataforma detectada ahora es una pastilla en vez de
  texto suelto.
- Los 4 botones de navegación pasaron de celdas de grilla con líneas
  divisorias a tarjetas redondeadas con el icono en una insignia propia;
  el estado activo ahora lo lleva el icono (degradado de marca) en vez de
  un subrayado.
- El título de cada sección repite el icono del botón que la abrió, para
  que la identidad visual sea la misma en el botón y en el contenido
  (nuevo parámetro `opts.icono` en `PDDRender.pintarSeccion`).
- El semáforo de riesgo ganó un punto de color antes del texto.
- Los puntos clave se resaltan suavemente al pasar el cursor.
- "Ver documento oficial" y "Reportar un error" pasaron de enlaces de
  texto a pastillas de color, para invitar más al clic.
- Nuevo estado vacío con un icono de escudo atenuado en vez de solo texto.
- El pie muestra un check dentro de un círculo antes de la fecha de
  verificación.
- Burbuja flotante más grande, con degradado, sombra con tinte de marca y
  una animación de aparición de una sola vez (no en bucle).
- El panel abre con una curva de easing más suave (`cubic-bezier`) en vez
  de una transición lineal.
- Todas las animaciones nuevas respetan `prefers-reduced-motion`.

## [1.1.0] — 2026-09-12

Pasada de auditoría: seguridad, accesibilidad y contenido. Ver el informe
completo para el detalle de cada hallazgo.

### Seguridad
- `host_permissions` de Google acotado de `*://*.google.com/*` (alcanzaba
  Gmail, Drive, Accounts y la consola de Workspace) a solo el buscador
  (`www.google.*`).
- El widget flotante ahora vive dentro de un Shadow DOM cerrado
  (`attachShadow({mode:'closed'})`): ni el CSS de la página anfitriona se
  filtra hacia adentro, ni un script de terceros puede leer o tocar el
  widget desde afuera.
- Retirado el permiso `activeTab`, redundante con `host_permissions`.

### Cobertura
- Añadidos los dominios de Google de Perú, Venezuela, Ecuador, Uruguay,
  Paraguay, Bolivia, Guatemala, Costa Rica, Panamá, República Dominicana,
  El Salvador, Honduras y Nicaragua (antes solo cubría México, Argentina,
  Colombia, Chile y España).

### Contenido
- Cada resumen de Términos, Cookies y Derechos ahora muestra un semáforo de
  riesgo (alto / medio / bajo).
- Nueva fecha "Resúmenes verificados el [fecha]" visible en el pie, para
  saber qué tan reciente es el contenido.
- Nuevo enlace "Reportar un error en este resumen" (mailto:) en cada
  sección.

### Accesibilidad
- Los 4 botones de navegación sincronizan `aria-pressed` con su estado
  visual, para lectores de pantalla.
- Foco visible (`:focus-visible`) en botones y enlaces — antes el reset de
  CSS lo eliminaba sin reemplazarlo.
- Al cerrar el panel con Escape, el foco vuelve al botón de la burbuja.
- Contraste de color corregido en el mensaje vacío y el descargo del pie
  (antes por debajo del mínimo WCAG AA).
- Soporte de tema oscuro (`prefers-color-scheme`).

### UX
- El widget flotante cambió de la esquina inferior derecha a la izquierda,
  para no solaparse con el chat nativo de Facebook Messenger ni con los
  widgets de soporte que casi siempre ocupan la derecha.
- El descargo del pie pasó de 9.5px a 11px.

### Arquitectura
- La lógica de interfaz (botones, pintado de secciones, pie) que estaba
  duplicada entre `content.js` y `popup.js` ahora vive una sola vez en
  `render.js`, compartido por las dos superficies.
- Los datos (`PLATAFORMAS`, `BOTONES`) se movieron de `content.js` a un
  `data.js` propio.

### Otros
- Iconos de la extensión (16/48/128 px).
- `README.md`, `PRIVACY.md` y este `CHANGELOG.md`.

## [1.0.0] — 2026-09-02

Primera versión: detección de Facebook, Instagram, TikTok, Google y
YouTube; popup y widget flotante con resúmenes de Términos, Cookies,
Derechos y Avisos.
