/* ==========================================================================
   PROTECTOR DE DERECHOS DIGITALES · content.js
   --------------------------------------------------------------------------
   El "vigilante": Chrome lo inyecta automáticamente en las páginas
   declaradas en manifest.json (después de data.js y render.js, que ya
   dejaron listos window.PDD_DATA y window.PDDRender). Este archivo hace 3
   cosas y nada más:

     1) DETECTA en qué red social está el usuario (por el dominio).
     2) RESPONDE al popup cuando pregunta "¿dónde estoy?" — es la única
        fuente de verdad de los datos, así el popup nunca los duplica.
     3) DIBUJA un widget flotante dentro de un Shadow DOM cerrado, para que
        ni el CSS de la página se filtre hacia adentro ni un script de
        terceros pueda leer o tocar el widget desde afuera.
   ========================================================================== */

(() => {
  'use strict';

  // Guarda anti-duplicado: si el popup vuelve a inyectar este script,
  // no queremos dos widgets ni dos escuchas de mensajes.
  if (window.__pddCargado) return;
  window.__pddCargado = true;

  const { PLATAFORMAS, BOTONES, DESCARGO, VERIFICADO, CONTACTO_SOPORTE } = window.PDD_DATA;
  const { crear, pintarVacio, pintarSeccion, crearBotones, crearPie } = window.PDDRender;

  /* ======================================================================
     1. EL VIGILANTE: ¿en qué red social estamos?
     ====================================================================== */

  function detectarPlataforma(host) {
    const h = (host || location.hostname).replace(/^www\./, '').toLowerCase();

    if (h.endsWith('facebook.com'))  return 'facebook';
    if (h.endsWith('instagram.com')) return 'instagram';
    if (h.endsWith('tiktok.com'))    return 'tiktok';
    if (h.endsWith('youtube.com'))   return 'youtube';
    // google.com, google.es, google.com.mx, google.cl... (dominios nacionales)
    if (/(^|\.)google\.[a-z]{2,3}(\.[a-z]{2})?$/.test(h)) return 'google';

    return null; // no es una plataforma vigilada
  }

  const idPlataforma = detectarPlataforma();

  /* ======================================================================
     2. PUENTE CON EL POPUP
     ----------------------------------------------------------------------
     popup.js pregunta "¿dónde estoy y qué le cuento al usuario?" y este
     script responde con los datos de data.js. Así los textos viven en un
     único sitio.
     ====================================================================== */

  chrome.runtime.onMessage.addListener((mensaje, _remitente, responder) => {
    if (mensaje && mensaje.tipo === 'PDD_PEDIR_INFO') {
      responder({
        plataforma: idPlataforma,
        datos: idPlataforma ? PLATAFORMAS[idPlataforma] : null,
        botones: BOTONES,
        descargo: DESCARGO,
        verificado: VERIFICADO,
        contacto: CONTACTO_SOPORTE
      });
    }
    return false; // respuesta síncrona: no mantenemos el canal abierto
  });

  // Si no es una red social vigilada, el vigilante termina aquí:
  // no dibujamos nada en la página.
  if (!idPlataforma) return;

  /* ======================================================================
     3. WIDGET FLOTANTE, AISLADO EN UN SHADOW DOM CERRADO
     ====================================================================== */

  const CLAVE_OCULTO = 'pdd_oculto';

  // Si el usuario cerró el widget en esta pestaña, respetamos su decisión.
  try {
    if (sessionStorage.getItem(CLAVE_OCULTO) === '1') return;
  } catch (e) { /* algunos sitios bloquean sessionStorage: seguimos igual */ }

  const datos = PLATAFORMAS[idPlataforma];

  // El host vive en el DOM normal de la página (por eso puede ser fixed y
  // flotar sobre todo), pero todo su contenido cuelga de un shadow root
  // "closed": ni el CSS de Facebook/TikTok se cuela hacia adentro, ni un
  // script de la página puede alcanzar host.shadowRoot desde afuera.
  const host = document.createElement('div');
  host.id = 'pdd-widget';
  host.classList.add('pdd-cerrado');
  const shadow = host.attachShadow({ mode: 'closed' });
  document.documentElement.appendChild(host);

  // El CSS es el mismo archivo que usa popup.html, pedido como texto e
  // inyectado como <style> DENTRO del shadow root (un <link> normal no
  // atravesaría el shadow boundary). Construimos la interfaz recién cuando
  // llega, para no mostrar un instante sin estilos.
  fetch(chrome.runtime.getURL('styles.css'))
    .then((respuesta) => respuesta.text())
    .then((css) => {
      const estilo = document.createElement('style');
      estilo.textContent = css;
      shadow.appendChild(estilo);
      construirWidget();
    })
    // Sin la hoja de estilos no hay widget que valga: todo su posicionamiento
    // (:host fixed) y el estado plegado viven ahí, así que construirlo igual
    // dejaría un bloque suelto al final de la página en vez de una burbuja.
    // Pasa sobre todo al recargar la extensión con pestañas ya abiertas: el
    // script viejo queda huérfano y getURL() devuelve chrome-extension://invalid/.
    .catch(() => host.remove());

  function construirWidget() {
    // --- Botón flotante (burbuja) ------------------------------------
    const burbuja = crear('button', 'pdd-fab', '\u{1F6E1}\u{FE0F}');
    burbuja.type = 'button';
    burbuja.title = 'Protector de Derechos Digitales';
    burbuja.setAttribute('aria-label', 'Abrir Protector de Derechos Digitales');
    burbuja.setAttribute('aria-expanded', 'false');

    // --- Panel desplegable --------------------------------------------
    const panel = crear('div', 'pdd-panel');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Protector de Derechos Digitales');
    panel.setAttribute('tabindex', '-1');

    const cabecera = crear('div', 'pdd-header');
    const titulos = crear('div', 'pdd-header-txt');
    titulos.appendChild(crear('span', 'pdd-titulo', 'Protector de Derechos Digitales'));
    titulos.appendChild(crear('span', 'pdd-sub', datos.emoji + '  Detectado: ' + datos.nombre));
    const cerrar = crear('button', 'pdd-cerrar', '×');
    cerrar.type = 'button';
    cerrar.title = 'Ocultar hasta recargar la página';
    cerrar.setAttribute('aria-label', 'Ocultar el widget hasta recargar la página');
    cabecera.appendChild(titulos);
    cabecera.appendChild(cerrar);

    const nav = crear('div', 'pdd-nav');
    const contenido = crear('div', 'pdd-contenido');
    pintarVacio(contenido);
    const pie = crear('div', 'pdd-footer');
    crearPie(pie, { descargo: DESCARGO, verificado: VERIFICADO });

    panel.appendChild(cabecera);
    panel.appendChild(nav);
    panel.appendChild(contenido);
    panel.appendChild(pie);

    shadow.appendChild(panel);
    shadow.appendChild(burbuja);

    crearBotones({
      contenedor: nav,
      botones: BOTONES,
      onCambiar: (clave) => {
        if (!clave) return pintarVacio(contenido);
        const boton = BOTONES.find((b) => b.clave === clave);
        pintarSeccion(contenido, datos.secciones[clave], {
          contacto: CONTACTO_SOPORTE,
          nombrePlataforma: datos.nombre,
          icono: boton && boton.icono
        });
      }
    });

    // Abrir / replegar el panel
    burbuja.addEventListener('click', () => {
      const cerrado = host.classList.toggle('pdd-cerrado');
      burbuja.setAttribute('aria-expanded', String(!cerrado));
      if (!cerrado) panel.focus();
    });

    // Ocultar el widget por completo durante esta sesión de pestaña
    cerrar.addEventListener('click', () => {
      host.remove();
      try { sessionStorage.setItem(CLAVE_OCULTO, '1'); } catch (e) {}
    });

    // Escape repliega el panel y devuelve el foco a la burbuja, para no
    // dejar «perdido» a quien navega solo con teclado.
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !host.classList.contains('pdd-cerrado')) {
        host.classList.add('pdd-cerrado');
        burbuja.setAttribute('aria-expanded', 'false');
        burbuja.focus();
      }
    });
  }
})();
