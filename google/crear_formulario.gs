/**
 * KC Basic · crea el formulario de XV y la hoja de pedidos en Drive/invitaciones/basic.
 * Se ejecuta UNA sola vez: botón ▶ Ejecutar con la función crearTodo.
 */
var CARPETA_BASIC = "1jhk8EizmAyKR1dv6R0qyDT8Nvs_J0gXx";
var DATOS = {"invitacion": ["Hay momentos que imaginamos, soñamos y esperamos. Hoy uno de ellos se hace realidad y quiero vivirlo contigo. [xv-inv-01]", "Con la bendición de Dios y el amor de mis padres, te invito a celebrar mis quince años. [xv-inv-02]", "Con mucha alegría, mis papás y yo te invitamos a celebrar mis 15 años, un día muy especial que quiero compartir contigo. [xv-inv-03]", "Quince años de risas, aprendizajes y sueños. Me encantaría que celebraras esta nueva etapa conmigo. [xv-inv-04]", "Has sido parte de mi historia, por eso quiero que estés en uno de sus días más importantes: mis XV años. [xv-inv-05]"], "cita": ["Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis. — Jeremías 29:11 [cita-jer-29-11]", "Los sueños no tienen edad, pero hoy los míos cumplen quince. [cita-kc-01]", "Brilla con tu voz y sueña con el corazón. [cita-kc-02]", "Ninguna"], "cierre": ["Será una noche inolvidable y me encantaría contar con tu presencia. [cierre-01]", "Tu presencia es el mejor regalo. ¡Te espero! [cierre-02]", "Nos vemos para celebrar juntos este gran día. [cierre-03]"], "reglas": ["Llega puntual: la magia empieza a tiempo. [puntual]", "Toma muchas fotos: esta noche es para recordar. [fotos]", "Baila sin pena y disfruta cada canción. [bailar]", "Diviértete al máximo, esta noche es para celebrar. [disfrutar]", "Regla de oro: no aburrirse. [no_aburrirse]"], "politica": ["Para disfrutar al máximo, la celebración es solo para adultos. [solo_adultos]", "Este evento está pensado para jóvenes y adultos. [jovenes_adultos]", "Si vienes con niños, te pedimos que estén acompañados en los momentos especiales: vals, brindis y pastel. [ninos_supervisados]", "No se permite el ingreso de mascotas. [sin_mascotas]"], "colores": ["blanco", "beige", "dorado", "plateado", "negro", "rojo", "vinotinto", "rosado", "fucsia", "lila", "morado", "azul", "azul claro", "verde", "verde menta", "amarillo", "naranja", "gris"]};
var DEMOS = "https://nueva.kcdigitalmagic.com/#demos";

function crearTodo() {
  var carpeta = DriveApp.getFolderById(CARPETA_BASIC);
  var form = FormApp.create("KC Basic · Formulario XV años");
  form.setTitle("Tu invitación KC Basic · XV años")
      .setDescription("Gracias por tu compra. Con estos datos armamos tu invitación: la tendrás en 24 a 48 horas hábiles desde que completes el formulario. Toma unos 10 minutos.")
      .setCollectEmail(true).setAllowResponseEdits(true).setProgressBar(true)
      .setConfirmationMessage("¡Listo! Recibimos tus datos. En 24 a 48 horas hábiles te escribimos por WhatsApp con tu invitación. Si elegiste la versión con fotos, envíanoslas al WhatsApp +57 310 403 6208 como documento.");
  var url = function (t) { return FormApp.createTextValidation().requireTextContainsPattern("https://").setHelpText("Pega un enlace que empiece por https://").build(); };
  var max = function (n) { return FormApp.createTextValidation().requireTextLengthLessThanOrEqualTo(n).setHelpText("Máximo " + n + " caracteres").build(); };

  // 1. Pedido y portada
  form.addSectionHeaderItem().setTitle("1. Tu pedido y tu invitación");
  form.addTextItem().setTitle("Número de pedido").setHelpText("Lo encuentras en el correo de tu compra. Si no lo tienes, déjalo en blanco.");
  form.addTextItem().setTitle("Tu WhatsApp (con indicativo)").setHelpText("Ej. +57 300 000 0000. Por aquí te enviamos tu invitación.").setRequired(true);
  form.addTextItem().setTitle("Nombre de la quinceañera, tal como debe aparecer").setValidation(max(30)).setRequired(true);
  form.addDateItem().setTitle("Fecha del evento").setRequired(true);
  form.addListItem().setTitle("País del evento").setChoiceValues(["Colombia", "México", "Estados Unidos", "España", "Otro"]).setRequired(true);
  form.addMultipleChoiceItem().setTitle("Diseño y color").setHelpText("Mira los diseños en " + DEMOS)
      .setChoiceValues(["Moderna · Noche dorada", "Moderna · Rosa neón", "Moderna · Lila minimal", "Clásica · Marfil y dorado", "Clásica · Cielo y plata", "Clásica · Rosa palo"]).setRequired(true);
  form.addMultipleChoiceItem().setTitle("¿Tu invitación lleva fotos?")
      .setChoiceValues(["Sí, con fotos (portada y hasta 4 en galería)", "No, sin fotos"]).setRequired(true);

  // 2. Lugares
  form.addPageBreakItem().setTitle("2. Lugares y horas").setHelpText("Máximo 2 momentos. Si solo hay fiesta, deja el momento 2 en blanco. Para copiar el link: abre el lugar en Google Maps → Compartir → Copiar enlace.");
  [1, 2].forEach(function (i) {
    var req = i === 1;
    form.addMultipleChoiceItem().setTitle("Momento " + i + ": ¿qué es?").setChoiceValues(["Misa", "Ceremonia", "Ceremonia civil", "Recepción / fiesta"]).setRequired(req);
    form.addTextItem().setTitle("Momento " + i + ": nombre del lugar").setValidation(max(50)).setRequired(req);
    form.addTextItem().setTitle("Momento " + i + ": dirección").setValidation(max(80)).setRequired(req);
    form.addTimeItem().setTitle("Momento " + i + ": hora").setRequired(req);
    form.addTextItem().setTitle("Momento " + i + ": link de Google Maps").setValidation(url()).setRequired(req);
  });

  // 3. Familia
  form.addPageBreakItem().setTitle("3. Familia").setHelpText("Deja en blanco lo que no quieras mostrar.");
  form.addTextItem().setTitle("Padres · línea 1").setHelpText("Ej. Laura Gómez").setValidation(max(40));
  form.addTextItem().setTitle("Padres · línea 2").setValidation(max(40));
  form.addTextItem().setTitle("Padrinos · línea 1").setHelpText("Una pareja puede ir en una línea: Marta y Julián").setValidation(max(40));
  form.addTextItem().setTitle("Padrinos · línea 2").setValidation(max(40));

  // 4. Textos
  form.addPageBreakItem().setTitle("4. Textos");
  form.addMultipleChoiceItem().setTitle("Frase de invitación").setHelpText("Elige una, o escribe la tuya en «Otro» (máximo 280 caracteres).").setChoiceValues(DATOS.invitacion).showOtherOption(true).setRequired(true);
  form.addMultipleChoiceItem().setTitle("Cita o frase especial").setChoiceValues(DATOS.cita);
  form.addMultipleChoiceItem().setTitle("Frase de cierre").setChoiceValues(DATOS.cierre).setRequired(true);

  // 5. Detalles
  form.addPageBreakItem().setTitle("5. Detalles de la fiesta");
  form.addMultipleChoiceItem().setTitle("Código de vestimenta").setChoiceValues(["Etiqueta", "Formal", "Semiformal", "Casual", "Temático", "No mostrar"]).setRequired(true);
  form.addCheckboxItem().setTitle("Colores reservados (que los invitados no usen)").setChoiceValues(DATOS.colores);
  form.addTextItem().setTitle("Nota de vestimenta").setValidation(max(140));
  form.addMultipleChoiceItem().setTitle("Regalos").setChoiceValues(["Lluvia de sobres", "Mesa de regalos", "Solo tu presencia", "No mostrar"]).setRequired(true);
  form.addTextItem().setTitle("Link de la mesa de regalos").setValidation(url());
  form.addCheckboxItem().setTitle("Reglas de la noche").setChoiceValues(DATOS.reglas);
  form.addCheckboxItem().setTitle("Avisos para los invitados").setChoiceValues(DATOS.politica);
  form.addTextItem().setTitle("Hashtag para redes").setHelpText("Empieza con # y sin espacios. Ej. #AnaXV")
      .setValidation(FormApp.createTextValidation().requireTextMatchesPattern("#\\S+").setHelpText("Empieza con # y sin espacios").build());

  // 6. Confirmación
  form.addPageBreakItem().setTitle("6. Confirmación de asistencia");
  form.addMultipleChoiceItem().setTitle("¿Cómo confirman los invitados?").setChoiceValues(["Por WhatsApp", "Con un enlace mío (formulario propio)"]).setRequired(true);
  form.addTextItem().setTitle("WhatsApp para confirmaciones (con indicativo)").setHelpText("Si eligiste WhatsApp. Ej. +57 300 000 0000");
  form.addTextItem().setTitle("Enlace de tu formulario").setHelpText("Si eligiste enlace propio").setValidation(url());
  form.addDateItem().setTitle("Fecha límite para confirmar").setRequired(true);
  form.addCheckboxItem().setTitle("Autorización").setChoiceValues(["Autorizo publicar los datos y fotos de este formulario en la invitación, y acepto que la página se retire 5 días después del evento."]).setRequired(true);

  // Hoja de pedidos
  var hoja = SpreadsheetApp.create("KC Basic · Pedidos");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(3000);
  var resp = hoja.getSheets().filter(function (s) { return s.getFormUrl(); })[0] || hoja.getSheets()[0];
  resp.setName("Formulario");
  var ultima = resp.getLastColumn();
  var extra = ["Estado", "Inicio", "Entrega", "Enlace", "Cambios usados", "Despublicar", "Notas"];
  resp.getRange(1, ultima + 1, 1, extra.length).setValues([extra]).setBackground("#8E2A7E").setFontColor("#FFFFFF").setFontWeight("bold");
  var estados = ["Esperando formulario", "Formulario recibido", "Esperando datos", "Datos aprobados", "Generada", "Revisada", "Enviada al cliente", "Ajustes hechos", "Entregada", "Cerrada"];
  resp.getRange(2, ultima + 1, 998, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(estados, true).build());
  resp.getRange(2, ultima + 2, 998, 2).setNumberFormat("yyyy-mm-dd");
  resp.getRange(2, ultima + 6, 998, 1).setNumberFormat("yyyy-mm-dd");
  resp.setFrozenRows(1);

  // Si quedó la pestaña vacía original, se elimina
  hoja.getSheets().forEach(function (sh) { if (sh.getName() !== "Formulario" && sh.getLastRow() === 0 && hoja.getSheets().length > 1) hoja.deleteSheet(sh); });

  DriveApp.getFileById(form.getId()).moveTo(carpeta);
  DriveApp.getFileById(hoja.getId()).moveTo(carpeta);
  Logger.log("Formulario para clientes: " + form.getPublishedUrl());
  Logger.log("Editar formulario: " + form.getEditUrl());
  Logger.log("Hoja de pedidos: " + hoja.getUrl());
}
