# NetSentry
# Política de privacidad — Protector de Derechos Digitales

Última actualización: 12 de septiembre de 2026.

## Resumen

**Esta extensión no recolecta, no transmite ni almacena remotamente ningún
dato personal.** No tiene servidor propio, no hace ninguna llamada de red
salvo para cargar su propia hoja de estilos empaquetada, y no comparte
información con Facebook, Instagram, TikTok, Google, YouTube ni con nadie
más.

## Qué hace la extensión

Al entrar a una de las cinco plataformas indicadas, la extensión:

1. Lee el nombre de dominio de la pestaña activa (`location.hostname`) para
   saber en qué red social estás, únicamente dentro del propio navegador.
2. Muestra un resumen —redactado de antemano y guardado dentro de la propia
   extensión— de los Términos, la Política de Cookies, los derechos en
   riesgo y los avisos de esa plataforma.

Eso es todo. La extensión no lee el contenido de tus publicaciones, tus
mensajes, tus fotos ni ningún otro dato de tu cuenta.

## Qué datos NO recolecta

- No hay analítica ni telemetría de uso.
- No hay identificadores de usuario ni huellas de dispositivo.
- No se guarda historial de qué secciones abriste, salvo la marca
  `pdd_oculto` en `sessionStorage` del propio navegador (para recordar que
  cerraste el widget mientras esa pestaña siga abierta) — ese dato nunca
  sale del navegador y desaparece al cerrar la pestaña.

## El botón "Reportar un error en este resumen"

Abre tu programa de correo con un `mailto:` prellenado hacia la dirección
de contacto del desarrollador. Si decides enviarlo, esa información la
recibe el desarrollador por correo, igual que cualquier otro email que
mandes — la extensión en sí no la procesa ni la guarda.

## Permisos que pide la extensión

- **`scripting`**: para poder cargar la extensión en una pestaña que ya
  estaba abierta antes de instalarla.
- **Acceso a Facebook, Instagram, TikTok, Google y YouTube**: para poder
  detectar en cuál de esas cinco páginas estás y mostrar el resumen
  correspondiente. No se usa para leer ni modificar el contenido de esas
  páginas más allá de añadir el widget flotante propio.

## Contacto

Si tienes preguntas sobre esta política, escribe a la dirección indicada en
la propia extensión (botón "Reportar un error en este resumen").

---

*Esta política describe el comportamiento del código tal como está escrito
en este repositorio. Quien publique una versión modificada de esta
extensión es responsable de mantener esta política actualizada acorde a
los cambios que introduzca.*
