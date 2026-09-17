/* ==========================================================================
   PROTECTOR DE DERECHOS DIGITALES · data.js
   --------------------------------------------------------------------------
   Contenido puro: nada de DOM, nada de detección de plataforma. Quien tenga
   que corregir una frase de un resumen legal debería poder hacerlo aquí sin
   tocar ni una línea de content.js.

   Se carga SOLO en el content script (ver manifest.json → content_scripts.js)
   y expone todo bajo window.PDD_DATA para que content.js lo consuma. El
   popup NUNCA importa este archivo: le pide los datos a content.js por
   mensaje, así hay una única fuente de verdad para los 5 archivos del
   proyecto.
   ========================================================================== */

(() => {
  'use strict';

  if (window.PDD_DATA) return; // ya registrado en este contexto: no repetir

  const DESCARGO =
    'Resumen informativo y educativo. No es asesoria legal ni sustituye a los ' +
    'documentos oficiales. Extension no afiliada a estas plataformas.';

  // Fecha en que se revisó por última vez el TEXTO de los resúmenes (no la
  // fecha de instalación ni la de hoy): cámbiala a mano cada vez que edites
  // el contenido de PLATAFORMAS para que el usuario sepa qué tan reciente es.
  const VERIFICADO = '2026-09-12';

  // TODO(dev): sustituye esto por un correo real antes de publicar la
  // extensión — es el destino del botón "Reportar un error en este resumen"
  // (el enlace mailto: lo arma render.js, aquí solo vive la dirección).
  const CONTACTO_SOPORTE = 'reportes@tu-dominio.example';

  /* ======================================================================
     BASE DE DATOS DE RESUMENES
     ----------------------------------------------------------------------
     Estructura: PLATAFORMAS[id].secciones[clave] = { titulo, puntos[], fuente, riesgo? }
     "riesgo" (alto | medio | bajo) es una valoración editorial de cuánto
     compromete cada sección tus derechos digitales; "avisos" no lleva
     riesgo porque son recomendaciones, no una descripción de la plataforma.
     Los puntos son frases cortas y accionables, NO parrafos legales.
     ====================================================================== */

  const PLATAFORMAS = {

    /* ---------------------------- FACEBOOK ---------------------------- */
    facebook: {
      nombre: 'Facebook',
      emoji: '\u{1F4D8}',
      secciones: {
        tyc: {
          titulo: 'Términos y Condiciones',
          fuente: 'https://www.facebook.com/legal/terms',
          riesgo: 'medio',
          puntos: [
            'Al publicar cedes a Meta una licencia mundial, gratuita y transferible sobre tu contenido.',
            'La licencia termina al borrar el contenido, salvo copias de seguridad o si otros lo compartieron.',
            'Pueden limitar, suspender o eliminar tu cuenta si consideran que incumples las Normas Comunitarias.',
            'El servicio es «gratis» porque se financia con publicidad basada en tus datos.',
            'Edad mínima: 13 años (más en algunos países).',
            'Si sigues usando la plataforma tras un cambio de términos, se entiende que los aceptas.'
          ]
        },
        cookies: {
          titulo: 'Política de Cookies',
          fuente: 'https://www.facebook.com/policies/cookies/',
          riesgo: 'alto',
          puntos: [
            'Usan cookies propias y de terceros dentro y FUERA de Facebook.',
            'El «píxel de Meta» te rastrea en webs y apps externas que lo instalan.',
            'Sirven para seguridad, personalización del feed y medición de anuncios.',
            'Rechazar las opcionales no elimina las llamadas «necesarias».',
            'Control: Configuración → Preferencias de anuncios → Actividad fuera de Facebook.'
          ]
        },
        derechos: {
          titulo: 'Derechos digitales en riesgo',
          fuente: 'https://www.facebook.com/privacy/policy/',
          riesgo: 'alto',
          puntos: [
            'Privacidad: se registra actividad, ubicación y dispositivos, incluso fuera de la app.',
            'Protección de datos: perfilado publicitario muy detallado (intereses, relaciones, hábitos).',
            'Contenido propio: cedes una licencia amplia sobre tus fotos y vídeos.',
            'Libertad de expresión: moderación automatizada con explicación y apelación limitadas.',
            'Derecho al olvido: eliminar la cuenta no borra de inmediato todas las copias.',
            'Portabilidad: SÍ tienes derecho a descargar tus datos («Tu información»).'
          ]
        },
        avisos: {
          titulo: 'Avisos y recomendaciones',
          fuente: 'https://www.facebook.com/privacy/checkup/',
          puntos: [
            'Desconecta y borra el historial de «Actividad fuera de Facebook».',
            'Pon tus publicaciones en «Solo amigos» y revisa quién ve tu lista de contactos.',
            'Activa la verificación en dos pasos.',
            'Revisa las apps de terceros conectadas a tu cuenta y elimina las que no uses.',
            'Descarga una copia de tus datos ANTES de eliminar la cuenta.'
          ]
        }
      }
    },

    /* ---------------------------- INSTAGRAM --------------------------- */
    instagram: {
      nombre: 'Instagram',
      emoji: '\u{1F4F7}',
      secciones: {
        tyc: {
          titulo: 'Términos y Condiciones',
          fuente: 'https://help.instagram.com/581066165581870',
          riesgo: 'medio',
          puntos: [
            'Sigues siendo dueño de tus fotos, pero concedes a Meta licencia para usarlas y distribuirlas.',
            'Esa licencia incluye mostrar tu contenido a través de otros productos de Meta.',
            'No puedes usar métodos automatizados (bots, scraping) sin permiso escrito.',
            'Pueden retirar contenido o cerrar cuentas sin previo aviso en casos graves.',
            'Edad mínima: 13 años; las cuentas de menores nacen con ajustes restringidos.'
          ]
        },
        cookies: {
          titulo: 'Política de Cookies',
          fuente: 'https://privacycenter.instagram.com/policies/cookies/',
          riesgo: 'alto',
          puntos: [
            'Comparte la infraestructura de cookies y píxeles de Meta.',
            'Registran qué ves, cuánto tiempo miras cada reel y con qué interactúas.',
            'El navegador interno de la app puede registrar tu actividad en webs externas.',
            'Se usan para recomendar contenido y segmentar anuncios y compras.',
            'Control: Configuración → Actividad fuera de las apps de Meta.'
          ]
        },
        derechos: {
          titulo: 'Derechos digitales en riesgo',
          fuente: 'https://privacycenter.instagram.com/policies/privacy/',
          riesgo: 'alto',
          puntos: [
            'Imagen personal: tus fotos y vídeos alimentan recomendaciones y publicidad.',
            'Datos sensibles: el algoritmo infiere intereses, estado de ánimo y hábitos.',
            'Menores: exposición y contacto de desconocidos pese a los filtros por edad.',
            'Propiedad intelectual: tu contenido puede reutilizarse dentro de la plataforma.',
            'Salud digital: diseño orientado a maximizar el tiempo de uso (scroll infinito).'
          ]
        },
        avisos: {
          titulo: 'Avisos y recomendaciones',
          fuente: 'https://help.instagram.com/196883487377501',
          puntos: [
            'Pon la cuenta en privado si no necesitas alcance público.',
            'Desactiva «Mostrar actividad» y el estado en línea.',
            'Revisa los «Temas sensibles» y limita las recomendaciones.',
            'Elimina la ubicación de las publicaciones y de las historias.',
            'Configura límites de tiempo de uso para reducir el consumo pasivo.'
          ]
        }
      }
    },

    /* ------------------------------ TIKTOK ---------------------------- */
    tiktok: {
      nombre: 'TikTok',
      emoji: '\u{1F3B5}',
      secciones: {
        tyc: {
          titulo: 'Términos y Condiciones',
          fuente: 'https://www.tiktok.com/legal/page/eea/terms-of-service/es',
          riesgo: 'alto',
          puntos: [
            'Concedes una licencia mundial e irrevocable para usar, adaptar y distribuir tus vídeos.',
            'Tu contenido puede aparecer en promociones de la plataforma sin pago adicional.',
            'Pueden eliminar contenido o cuentas de forma unilateral.',
            'Limitan fuertemente su responsabilidad y fijan la jurisdicción aplicable.',
            'Edad mínima: 13 años, con una experiencia restringida para menores.'
          ]
        },
        cookies: {
          titulo: 'Política de Cookies',
          fuente: 'https://www.tiktok.com/legal/page/eea/cookie-policy/es',
          riesgo: 'alto',
          puntos: [
            'Cookies propias y de terceros, más SDK publicitarios en apps y webs asociadas.',
            'Recogen identificadores de dispositivo, IP, operador y patrones de uso.',
            'El navegador integrado de la app puede registrar lo que haces en webs externas.',
            'Los datos pueden transferirse y tratarse fuera de tu país.',
            'Control: Configuración → Privacidad → Personalización de anuncios.'
          ]
        },
        derechos: {
          titulo: 'Derechos digitales en riesgo',
          fuente: 'https://www.tiktok.com/legal/page/eea/privacy-policy/es',
          riesgo: 'alto',
          puntos: [
            'Privacidad: recolección muy amplia de datos de dispositivo y comportamiento.',
            'Datos biométricos: en algunas versiones se tratan rasgos faciales y de voz.',
            'Transferencias internacionales con distintos niveles de protección legal.',
            'Perfilado algorítmico intenso: el «Para ti» moldea lo que ves y lo que crees.',
            'Contenido: cedes derechos muy amplios sobre tus creaciones.',
            'Menores: alto riesgo de exposición y de retos virales peligrosos.'
          ]
        },
        avisos: {
          titulo: 'Avisos y recomendaciones',
          fuente: 'https://www.tiktok.com/safety/es/',
          puntos: [
            'Desactiva «Sincronizar contactos» y «Sugerir tu cuenta a otros».',
            'Activa el Modo restringido y la Sincronización familiar si hay menores.',
            'Revisa «Personalización de anuncios» y el historial de visualización.',
            'Cuidado con la desinformación y los retos virales que se difunden rápido.',
            'Abre los enlaces en tu navegador, no en el navegador interno de la app.'
          ]
        }
      }
    },

    /* ------------------------------ GOOGLE ---------------------------- */
    google: {
      nombre: 'Google',
      emoji: '\u{1F50D}',
      secciones: {
        tyc: {
          titulo: 'Términos y Condiciones',
          fuente: 'https://policies.google.com/terms?hl=es',
          riesgo: 'medio',
          puntos: [
            'Una sola cuenta conecta Búsqueda, Gmail, Maps, Drive, Android y YouTube.',
            'Conservas la propiedad de tu contenido, pero les das licencia para operar sus servicios.',
            'Pueden suspender el acceso por incumplimiento o por motivos legales.',
            'El servicio se ofrece «tal cual», con garantías y responsabilidad limitadas.',
            'Los cambios se notifican, pero seguir usando el servicio implica aceptarlos.'
          ]
        },
        cookies: {
          titulo: 'Política de Cookies',
          fuente: 'https://policies.google.com/technologies/cookies?hl=es',
          riesgo: 'medio',
          puntos: [
            'Cookies para sesión, preferencias, seguridad, analítica y publicidad.',
            'Google Analytics y sus anuncios están presentes en millones de webs de terceros.',
            'Te siguen entre sitios distintos para construir tu perfil publicitario.',
            'En la UE deben pedir consentimiento para las no esenciales: puedes rechazarlas.',
            'Control: adssettings.google.com y la «Comprobación de privacidad».'
          ]
        },
        derechos: {
          titulo: 'Derechos digitales en riesgo',
          fuente: 'https://policies.google.com/privacy?hl=es',
          riesgo: 'medio',
          puntos: [
            'Privacidad: historial de búsquedas, ubicación y voz asociados a tu cuenta.',
            'Perfilado: intereses inferidos para publicidad a partir de todo tu uso.',
            'Ubicación: la Cronología puede reconstruir tus movimientos diarios.',
            'Acceso y supresión: puedes ver y borrar tu actividad, pero no viene activado por defecto.',
            'Portabilidad: Google Takeout te permite exportar todos tus datos.',
            'Derecho al olvido: puedes pedir que retiren resultados de búsqueda sobre ti.'
          ]
        },
        avisos: {
          titulo: 'Avisos y recomendaciones',
          fuente: 'https://myaccount.google.com/privacycheckup',
          puntos: [
            'Entra en myactivity.google.com y activa el borrado automático (3 meses).',
            'Desactiva el Historial de ubicaciones y la Actividad web y de aplicaciones.',
            'Revisa las apps de terceros con acceso a tu cuenta y revoca las que no uses.',
            'Desactiva los anuncios personalizados en adssettings.google.com.',
            'Activa la verificación en dos pasos y revisa los dispositivos conectados.'
          ]
        }
      }
    },

    /* ----------------------------- YOUTUBE ---------------------------- */
    youtube: {
      nombre: 'YouTube',
      emoji: '\u{25B6}',
      secciones: {
        tyc: {
          titulo: 'Términos y Condiciones',
          fuente: 'https://www.youtube.com/t/terms',
          riesgo: 'medio',
          puntos: [
            'Al subir un vídeo das licencia a YouTube y también a los demás usuarios para verlo.',
            'YouTube puede insertar anuncios en tu vídeo aunque tú no estés monetizado.',
            'Content ID puede reclamar tu vídeo automáticamente por música o clips ajenos.',
            'Tres avisos (strikes) de copyright pueden cerrar tu canal.',
            'Pueden retirar contenido o cerrar canales que consideren no viables.'
          ]
        },
        cookies: {
          titulo: 'Política de Cookies',
          fuente: 'https://policies.google.com/technologies/cookies?hl=es',
          riesgo: 'medio',
          puntos: [
            'El historial de reproducción y búsqueda alimenta las recomendaciones.',
            'Los vídeos incrustados en OTRAS webs también instalan cookies de seguimiento.',
            'Se registran tiempo de visionado, pausas y hasta dónde ves cada vídeo.',
            'Comparte identificadores publicitarios con el resto de servicios de Google.',
            'Alternativa más privada para incrustar: youtube-nocookie.com.'
          ]
        },
        derechos: {
          titulo: 'Derechos digitales en riesgo',
          fuente: 'https://policies.google.com/privacy?hl=es',
          riesgo: 'alto',
          puntos: [
            'Propiedad intelectual: licencia amplia sobre lo que subes y reclamaciones automáticas.',
            'Privacidad: lo que ves revela ideología, salud, orientación y creencias.',
            'Transparencia algorítmica: no se explica por qué te recomienda cada vídeo.',
            'Moderación automatizada: desmonetización o retirada con apelación lenta.',
            'Menores: el contenido «para niños» tiene reglas y tratamiento de datos especiales.',
            'Salud digital: la reproducción automática está diseñada para encadenar visionados.'
          ]
        },
        avisos: {
          titulo: 'Avisos y recomendaciones',
          fuente: 'https://myaccount.google.com/yourdata/youtube',
          puntos: [
            'Pausa o borra el historial de reproducción y de búsqueda de YouTube.',
            'Desactiva la reproducción automática para no encadenar vídeos.',
            'Revisa «Anuncios personalizados» en tu cuenta de Google.',
            'Contrasta la información: las recomendaciones pueden amplificar desinformación.',
            'Si subes contenido, verifica las licencias de música e imágenes antes de publicar.'
          ]
        }
      }
    }
  };

  // Orden, icono y etiqueta de los 4 botones de la interfaz.
  const BOTONES = [
    { clave: 'tyc',      icono: '\u{1F4C4}', etiqueta: 'T&C' },
    { clave: 'cookies',  icono: '\u{1F36A}', etiqueta: 'Cookies' },
    { clave: 'derechos', icono: '\u{26A0}\u{FE0F}', etiqueta: 'Derechos' },
    { clave: 'avisos',   icono: '\u{2757}', etiqueta: 'Avisos' }
  ];

  window.PDD_DATA = { PLATAFORMAS, BOTONES, DESCARGO, VERIFICADO, CONTACTO_SOPORTE };
})();
