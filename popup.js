/* ==========================================================================
   PROTECTOR DE DERECHOS DIGITALES · popup.js
   --------------------------------------------------------------------------
   El "cerebro" de la ventana que se abre al pulsar el icono de la
   extensión. Su trabajo, en orden:

     1) Averiguar cuál es la pestaña activa.
     2) Preguntarle a content.js (el vigilante) en qué red social está y
        pedirle los resúmenes. Si no responde (por ejemplo, la pestaña ya
        estaba abierta cuando se instaló la extensión), inyecta los tres
        archivos del content script y vuelve a preguntar.
     3) Dibujar los 4 botones y el pie usando render.js — el mismo módulo
        que usa el widget flotante — y reaccionar a los clics.
   ========================================================================== */

'use strict';

const { crear, pintarVacio, pintarSeccion, crearBotones, crearPie } = window.PDDRender;

/* ------------------------- Referencias del DOM --------------------------- */
const $plataforma = document.getElementById('pdd-plataforma');
const $nav        = document.getElementById('pdd-nav');
const $contenido  = document.getElementById('pdd-contenido');
const $footer     = document.getElementById('pdd-footer');

/* ==========================================================================
   1. HABLAR CON EL VIGILANTE (content.js)
   ========================================================================== */

/**
 * Envía un mensaje al content script de la pestaña y devuelve su respuesta.
 * Devuelve null si nadie contesta (script no inyectado, página interna de
 * Chrome, Web Store, etc.) en lugar de lanzar un error.
 */
function pedirInfo(idPestana) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(idPestana, { tipo: 'PDD_PEDIR_INFO' }, (respuesta) => {
      // Leer lastError evita el aviso "Unchecked runtime.lastError" en consola
      if (chrome.runtime.lastError) return resolve(null);
      resolve(respuesta || null);
    });
  });
}

/* ==========================================================================
   2. ARRANQUE
   ========================================================================== */

async function iniciar() {
  // Pestaña visible en la ventana actual
  const [pestana] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!pestana || !pestana.id) return mostrarNoSoportado();

  // Primer intento: preguntar al vigilante
  let info = await pedirInfo(pestana.id);

  // Segundo intento: si no respondió, inyectamos los tres archivos del
  // content script a mano y repreguntamos. Pasa cuando la pestaña ya
  // estaba abierta antes de instalar la extensión, así que ni data.js ni
  // render.js llegaron a cargarse tampoco — hay que inyectar los tres.
  if (!info) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: pestana.id },
        files: ['data.js', 'render.js', 'content.js']
      });
      info = await pedirInfo(pestana.id);
    } catch (e) {
      // Páginas protegidas (chrome://, Web Store...) no admiten inyección
    }
  }

  // Sigue sin haber plataforma => no es una de las 5 redes vigiladas.
  // Si content.js SÍ respondió (solo que esta página no es una red social
  // vigilada), ya trae el descargo real de data.js; lo reutilizamos en vez
  // de duplicar el texto.
  if (!info || !info.plataforma || !info.datos) return mostrarNoSoportado(info && info.descargo);

  $plataforma.textContent = info.datos.emoji + '  Detectado: ' + info.datos.nombre;
  crearPie($footer, { descargo: info.descargo, verificado: info.verificado });

  crearBotones({
    contenedor: $nav,
    botones: info.botones,
    onCambiar: (clave) => {
      if (!clave) return pintarVacio($contenido);
      const boton = info.botones.find((b) => b.clave === clave);
      pintarSeccion($contenido, info.datos.secciones[clave], {
        contacto: info.contacto,
        nombrePlataforma: info.datos.nombre,
        icono: boton && boton.icono
      });
    }
  });

  pintarVacio($contenido);
}

/** Estado para páginas que no son una de las 5 redes vigiladas */
function mostrarNoSoportado(descargo) {
  $plataforma.textContent = 'Ninguna plataforma detectada';
  $nav.textContent = '';
  $contenido.textContent = '';
  $contenido.appendChild(crear('h2', 'pdd-h2', 'Aquí no hay nada que vigilar'));

  const lista = crear('ul', 'pdd-lista');
  [
    'Esta extensión funciona en Facebook, Instagram, TikTok, Google y YouTube.',
    'Abre una de esas webs y vuelve a pulsar el icono.',
    'Si acabas de instalarla, recarga la pestaña (F5).'
  ].forEach((t) => lista.appendChild(crear('li', 'pdd-punto', t)));
  $contenido.appendChild(lista);

  // Si no llegó un descargo real (content.js nunca respondió), usamos uno
  // de reserva para que el pie no quede vacío.
  crearPie($footer, {
    descargo: descargo ||
      'Resumen informativo y educativo. No es asesoría legal ni sustituye a los ' +
      'documentos oficiales. Extensión no afiliada a estas plataformas.'
  });
}

// Arrancar cuando el HTML del popup esté listo
document.addEventListener('DOMContentLoaded', iniciar);
