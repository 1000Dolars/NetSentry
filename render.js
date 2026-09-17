/* ==========================================================================
   PROTECTOR DE DERECHOS DIGITALES · render.js
   --------------------------------------------------------------------------
   Un único lugar para "cómo se dibuja la interfaz", usado tanto por el
   widget flotante (content.js, dentro de su Shadow DOM) como por el popup
   de la barra de Chrome (popup.js, en su propio documento). Antes esta
   lógica estaba copiada casi tal cual en los dos sitios; ahora hay un solo
   archivo que editar y dos contextos que lo cargan por su cuenta:

     · manifest.json → content_scripts.js incluye "render.js" antes de
       "content.js", así que window.PDDRender existe en el mundo aislado
       del content script.
     · popup.html carga <script src="render.js"> antes de <script
       src="popup.js">, así que window.PDDRender existe también ahí.

   Son DOS ejecuciones independientes del MISMO archivo — no hay estado
   compartido entre el popup y el widget (ni falta que hace), solo código
   compartido.
   ========================================================================== */

(() => {
  'use strict';

  if (window.PDDRender) return; // ya registrado en este contexto: no repetir

  /** Atajo para crear elementos: crear('div', 'clase', 'texto') */
  function crear(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto) nodo.textContent = texto;
    return nodo;
  }

  /** Mensaje inicial cuando no hay ninguna sección seleccionada. */
  function pintarVacio(contenedor) {
    contenedor.textContent = '';
    contenedor.appendChild(crear('p', 'pdd-vacio', 'Elige una sección para ver el resumen.'));
  }

  const ETIQUETA_RIESGO = { alto: 'Riesgo alto', medio: 'Riesgo medio', bajo: 'Riesgo bajo' };

  /** Arma un mailto: con asunto y cuerpo precargados para reportar un error. */
  function construirEnlaceReporte(contacto, nombrePlataforma, tituloSeccion) {
    const asunto = `Corrección: ${nombrePlataforma} — ${tituloSeccion}`;
    const cuerpo =
      `Plataforma: ${nombrePlataforma}\nSección: ${tituloSeccion}\n\n` +
      'Describe aquí qué punto ves desactualizado o incorrecto:\n\n';
    return `mailto:${contacto}` +
      `?subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpo)}`;
  }

  /**
   * Pinta el título (con su icono y su semáforo de riesgo si aplica), los
   * puntos clave y los enlaces de una sección dentro de `contenedor`.
   * `opts.icono`, si se pasa, repite el icono del botón que abrió esta
   * sección junto al título, para que la identidad visual sea la misma en
   * el botón y en el contenido. Si se pasan `opts.contacto` y
   * `opts.nombrePlataforma`, añade un enlace para reportar un error en ese
   * resumen concreto.
   */
  function pintarSeccion(contenedor, seccion, opts) {
    opts = opts || {};
    contenedor.textContent = '';

    const encabezado = crear('div', 'pdd-seccion-head');
    const tituloBox = crear('div', 'pdd-seccion-titulo-box');
    if (opts.icono) {
      tituloBox.appendChild(crear('span', 'pdd-seccion-icono', opts.icono));
    }
    tituloBox.appendChild(crear('h2', 'pdd-h2', seccion.titulo));
    encabezado.appendChild(tituloBox);
    if (seccion.riesgo && ETIQUETA_RIESGO[seccion.riesgo]) {
      encabezado.appendChild(
        crear('span', `pdd-riesgo pdd-riesgo--${seccion.riesgo}`, ETIQUETA_RIESGO[seccion.riesgo])
      );
    }
    contenedor.appendChild(encabezado);

    const lista = crear('ul', 'pdd-lista');
    seccion.puntos.forEach((punto) => lista.appendChild(crear('li', 'pdd-punto', punto)));
    contenedor.appendChild(lista);

    const acciones = crear('div', 'pdd-acciones');
    if (seccion.fuente) {
      const enlace = crear('a', 'pdd-fuente', 'Ver documento oficial ↗');
      enlace.href = seccion.fuente;
      enlace.target = '_blank';
      enlace.rel = 'noopener noreferrer';
      acciones.appendChild(enlace);
    }
    if (opts.contacto && opts.nombrePlataforma) {
      const reportar = crear('a', 'pdd-reportar', 'Reportar un error en este resumen');
      reportar.href = construirEnlaceReporte(opts.contacto, opts.nombrePlataforma, seccion.titulo);
      acciones.appendChild(reportar);
    }
    if (acciones.childNodes.length) contenedor.appendChild(acciones);

    contenedor.scrollTop = 0;
  }

  /**
   * Construye los botones de navegación dentro de `contenedor` y delega
   * los clics: alternar el mismo botón lo desactiva (comportamiento de
   * acordeón). Mantiene sincronizados tanto la clase visual `.pdd-activo`
   * como `aria-pressed`, para que un lector de pantalla anuncie cuál está
   * seleccionado. Llama a `onCambiar(clave | null)` en cada cambio; quien
   * llama decide qué pintar en el panel de contenido.
   */
  function crearBotones({ contenedor, botones, onCambiar }) {
    contenedor.textContent = '';
    const nodos = {};
    let activa = null;

    botones.forEach((b) => {
      const boton = crear('button', 'pdd-btn');
      boton.type = 'button';
      boton.dataset.clave = b.clave;
      boton.setAttribute('aria-pressed', 'false');
      boton.appendChild(crear('span', 'pdd-btn-icono', b.icono));
      boton.appendChild(crear('span', 'pdd-btn-txt', b.etiqueta));
      contenedor.appendChild(boton);
      nodos[b.clave] = boton;
    });

    contenedor.addEventListener('click', (ev) => {
      const boton = ev.target.closest('.pdd-btn');
      if (!boton) return;

      const clave = boton.dataset.clave;
      const siguiente = clave === activa ? null : clave;

      Object.keys(nodos).forEach((k) => {
        const seleccionado = k === siguiente;
        nodos[k].classList.toggle('pdd-activo', seleccionado);
        nodos[k].setAttribute('aria-pressed', String(seleccionado));
      });

      activa = siguiente;
      onCambiar(siguiente);
    });
  }

  /** DD de mes-en-texto AAAA a partir de un ISO "AAAA-MM-DD", sin librerías. */
  function formatearFecha(iso) {
    const [anio, mes, dia] = iso.split('-');
    const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const nombreMes = MESES[parseInt(mes, 10) - 1] || mes;
    return `${parseInt(dia, 10)} ${nombreMes} ${anio}`;
  }

  /** Pie común: fecha de verificación del contenido + descargo de responsabilidad. */
  function crearPie(contenedor, { descargo, verificado }) {
    contenedor.textContent = '';
    if (verificado) {
      contenedor.appendChild(
        crear('p', 'pdd-verificado', `Resúmenes verificados el ${formatearFecha(verificado)}.`)
      );
    }
    if (descargo) {
      contenedor.appendChild(crear('p', 'pdd-descargo', descargo));
    }
  }

  window.PDDRender = {
    crear, pintarVacio, pintarSeccion, crearBotones, crearPie, formatearFecha, construirEnlaceReporte
  };
})();
