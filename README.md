<p align="center">
  <img src="logo/logo.svg" alt="Logo de Protector de Derechos Digitales" width="120">
</p>

# Protector de Derechos Digitales

Extensión de Chrome (Manifest V3) que muestra un resumen corto —no el texto
legal completo— de los Términos y Condiciones, la Política de Cookies, los
derechos digitales en riesgo y los avisos de seguridad de Facebook,
Instagram, TikTok, Google (buscador) y YouTube.

No está afiliada a ninguna de esas plataformas. Los resúmenes son
informativos y educativos: no sustituyen a los documentos oficiales ni son
asesoría legal. Ver [PRIVACY.md](PRIVACY.md).

<p align="center">
  <a href="https://chromewebstore.google.com/detail/protector-de-derechos-dig/bginhjipdmnpcnknlemcebjlnnianhpe"><strong>Instalar desde la Chrome Web Store</strong></a>
  ·
  <a href="https://1000dolars.github.io/NetSentry/"><strong>Página de presentación</strong></a>
</p>

## Estructura del proyecto

| Archivo | Qué hace |
|---|---|
| `manifest.json` | Documento de identidad de la extensión: permisos, dominios, iconos. |
| `data.js` | Los textos de los resúmenes. Única fuente de verdad — solo se carga en el content script. |
| `render.js` | Cómo se dibuja la interfaz (botones, secciones, pie). Lo cargan tanto el popup como el widget. |
| `content.js` | Detecta la plataforma, responde al popup por mensaje y dibuja el widget flotante en un Shadow DOM cerrado. |
| `popup.html` / `popup.js` | La ventana que se abre al pulsar el icono de la barra de Chrome. |
| `styles.css` | Una sola hoja de estilos para las dos superficies (popup y widget). |
| `icons/` | Iconos que usa Chrome (toolbar, `chrome://extensions`), a 16/48/128 px. Mismo diseño que el logo, exportado a esos tamaños exactos. |
| `index.html` | Página de presentación del proyecto, publicada con GitHub Pages. No forma parte de la extensión. |
| `logo/` | El logo de marca en tamaño grande: `logo.svg` fuente vectorial, `logo-512.png` y `logo-1024.png` exportados para donde no se acepte SVG (ficha de la Chrome Web Store, redes, etc.). |

## Instalar en modo desarrollador

Para usarla, lo normal es instalarla [desde la Chrome Web
Store](https://chromewebstore.google.com/detail/protector-de-derechos-dig/bginhjipdmnpcnknlemcebjlnnianhpe).
Esto de aquí es para trabajar sobre el código: carga la carpeta tal cual, sin
empaquetar, y basta con pulsar *Actualizar* en `chrome://extensions` para ver
un cambio. Funciona igual en cualquier navegador basado en Chromium: Chrome,
Edge, Brave, Opera GX.

1. Abre `chrome://extensions` (o `edge://extensions`, `opera://extensions`...).
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y selecciona esta carpeta.

## Pendientes

Ya está publicada, así que estos dos dejaron de ser detalles de preparación y
pasaron a afectar a gente que la tiene instalada:

- **`CONTACTO_SOPORTE` sigue siendo una dirección de ejemplo.** En
  [data.js](data.js) apunta a `reportes@tu-dominio.example`, que no existe.
  Es el destino del botón "Reportar un error en este resumen", así que hoy
  ese botón abre un correo que no va a llegar a ninguna parte. Cámbialo por
  un correo real.
- **`LICENSE` no tiene titular.** El aviso de copyright dice
  `[Tu nombre aquí]`.

Y uno de mantenimiento continuo:

- **Revisa la fecha de `VERIFICADO`** en [data.js](data.js) cada vez que
  edites el contenido de `PLATAFORMAS`, para que el usuario sepa qué tan
  reciente es lo que lee. Las plataformas cambian sus términos sin avisar.

## Publicar una versión nueva en la Chrome Web Store

El `.zip` que pide la Web Store **no está versionado** en el repositorio
(`.gitignore` excluye `*.zip`): es un artefacto que se regenera, no código
fuente. Tiene que contener únicamente lo que la extensión necesita en tiempo
de ejecución — `manifest.json`, los cuatro `.js`, `popup.html`, `styles.css`
e `icons/` — y nada más: ni la documentación, ni `logo/`, ni `index.html`, ni
las capturas de la ficha, porque la Web Store no los usa para nada. Regenera
el zip cada vez que cambies alguno de esos archivos, antes de subir una
versión nueva.

Para subir una actualización:

1. **Sube el número de versión** en `manifest.json`. La Web Store rechaza un
   paquete cuya versión no sea mayor que la publicada; es el único campo que
   obliga a tocar.
2. Anota el cambio en [CHANGELOG.md](CHANGELOG.md).
3. Regenera el `.zip` con los archivos de la lista de arriba.
4. Entra al [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole),
   abre la ficha ya existente → **Paquete** → *Subir paquete nuevo*.
5. Envíala a revisión. Google puede tardar desde horas hasta varios días, y
   una actualización se revisa igual que la primera publicación.

Para la política de privacidad que pide el formulario sirve la copia
renderizada en GitHub:
`https://github.com/1000Dolars/NetSentry/blob/main/PRIVACY.md`.

Y la justificación de los permisos de host, por si vuelve a hacer falta: la
extensión pide acceso a Facebook, Instagram, TikTok, Google y YouTube para
detectar en cuál de esas cinco páginas está el usuario y mostrar el resumen
correspondiente. Nada más: no lee ni envía contenido de la página.

## Añadir otro dominio de Google

`detectarPlataforma()` en [content.js](content.js) ya reconoce cualquier
`google.<tld>` o `google.co.<tld>` de forma genérica. Lo único que falta al
añadir un país nuevo es declarar su dominio en **tres** listas de
[manifest.json](manifest.json): `host_permissions`,
`content_scripts[0].matches` y `web_accessible_resources[0].matches` — esta
última es la que permite al widget leer `styles.css`; si se olvida, el
widget no llega a dibujarse en ese dominio. Verifica el dominio exacto de Google para ese
país antes de añadirlo — no todos siguen el mismo patrón (por ejemplo,
Venezuela es `google.co.ve`, no `google.com.ve`).

## Página de presentación

[**1000dolars.github.io/NetSentry**](https://1000dolars.github.io/NetSentry/)
— una sola página que explica el proyecto: el problema, las cuatro secciones,
la matriz de riesgo por plataforma, la política de privacidad y cómo
instalarlo.

Vive en [index.html](index.html), en la raíz y no en una carpeta `docs/`, a
propósito: así puede cargar los archivos reales de la extensión y montar una
demo que no es una captura de pantalla, sino la misma interfaz que se instala
en el navegador. Repite la técnica de [content.js](content.js) —un Shadow DOM
con `styles.css` dentro— para que los estilos de la página y los de la
extensión no se pisen, y calcula las cifras y la matriz de riesgo al vuelo
desde `window.PDD_DATA`: cuando cambie un resumen en
[data.js](data.js), la página se entera sola. No carga ningún recurso de
terceros.

Para verla en local hace falta un servidor (los `<script src>` relativos no
funcionan abriendo el archivo con doble clic desde ciertos navegadores):

```bash
python -m http.server 4173
```

## Historial de cambios

Ver [CHANGELOG.md](CHANGELOG.md).
