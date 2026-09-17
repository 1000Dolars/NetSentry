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
| `logo/` | El logo de marca en tamaño grande: `logo.svg` fuente vectorial, `logo-512.png` y `logo-1024.png` exportados para donde no se acepte SVG (ficha de la Chrome Web Store, redes, etc.). |

## Instalar en modo desarrollador

Funciona igual en cualquier navegador basado en Chromium: Chrome, Edge,
Brave, Opera GX.

1. Abre `chrome://extensions` (o `edge://extensions`, `opera://extensions`...).
2. Activa **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y selecciona esta carpeta.

## Antes de publicarla

- **Cambia `CONTACTO_SOPORTE`** en [data.js](data.js) por un correo real — es
  el destino del botón "Reportar un error en este resumen". Tal como está,
  apunta a una dirección de ejemplo que no existe.
- **Revisa la fecha de `VERIFICADO`** en [data.js](data.js) cada vez que
  edites el contenido de `PLATAFORMAS`, para que el usuario sepa qué tan
  reciente es lo que lee.
- **Publica [PRIVACY.md](PRIVACY.md)** en una URL propia — la Chrome Web
  Store la exige por los permisos de host que pide la extensión.
- La Chrome Web Store también pide capturas de pantalla y una descripción
  para la ficha; no vienen incluidas en este repositorio.

## Publicar en la Chrome Web Store

El archivo `protector-derechos-digitales-1.4.0.zip` en la raíz del proyecto
ya está armado para subir tal cual: contiene únicamente lo que la extensión
necesita en tiempo de ejecución (`manifest.json`, los `.js`, `popup.html`,
`styles.css` e `icons/`) — ni la documentación ni `logo/` van dentro, porque
la Web Store no los usa para nada. Cada vez que cambies alguno de esos
archivos, regenera el zip (súbelo a mano con el Explorador de Windows, o
pide que se vuelva a generar) antes de subir una nueva versión.

Antes de subirlo:

1. Completa los dos pendientes de la sección anterior (`CONTACTO_SOPORTE` y,
   si aplica, el nombre en `LICENSE`).
2. Publica [PRIVACY.md](PRIVACY.md) en una URL propia — el formulario de la
   Web Store pide un enlace a la política de privacidad, no un archivo.
3. Entra al [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   (pide una cuota única de registro de desarrollador si es tu primera vez).
4. **Nuevo artículo** → sube el `.zip`.
5. Completa la ficha: descripción, categoría, capturas de pantalla (no
   incluidas aquí — al menos una, 1280×800 o 640×400), y el icono de la
   ficha (puedes usar `logo/logo-512.png`).
6. En la pestaña **Prácticas de privacidad**, justifica por qué la extensión
   pide acceso a Facebook/Instagram/TikTok/Google/YouTube: para detectar en
   cuál de esas cinco páginas está el usuario y mostrar el resumen
   correspondiente — nada más. Pega el enlace a tu `PRIVACY.md` publicado.
7. Envíala a revisión. Google puede tardar desde horas hasta varios días.

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

## Historial de cambios

Ver [CHANGELOG.md](CHANGELOG.md).
