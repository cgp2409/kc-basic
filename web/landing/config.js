/* =====================================================================
   KC DIGITAL MAGIC · CONTENIDO DE LA PÁGINA
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para cambiar textos,
   enlaces, precios, imágenes, preguntas frecuentes, etc.
   - Solo cambia lo que está entre comillas "..."
   - No borres comas, llaves { } ni corchetes [ ].
   - Para imágenes: guarda el archivo en la carpeta /img y escribe su
     nombre aquí, ej: "img/karol-y-cristhian.jpg"
   - Para ocultar algo opcional, déjalo vacío: ""
   ===================================================================== */

window.SITE = {

  /* ---------- 1. GENERAL Y CONTACTO ---------- */
  marca: "KC Digital Magic",
  siglas: "KC",                                   // texto del sello/logo redondo
  logo: "",                                       // opcional: "img/logo.png" (reemplaza el sello KC)
  whatsapp: "573104036208",                       // solo números, con código de país
  whatsappTexto: "+57 310 403 6208",              // cómo se ve en el pie de página
  whatsappMensaje: "Hola, vi su página y quiero información para mi evento",
  email: "contacto@kcdigitalmagic.com",
  instagram: "https://www.instagram.com/kcdigitalmagic",
  facebook: "https://www.facebook.com/kcdigitalmagic",
  blog: "https://kcdigitalmagic.com/blog?utm_source=landing&utm_medium=web&utm_campaign=footer",
  botonWhatsappFlotante: true,                    // botón flotante en celular (true / false)

  /* ---------- 1b. TIENDA (KC Basic se compra en línea) ---------- */
  tienda: {
    comprar: "/product/kc-basic-xv/",           // página del producto en WooCommerce
    botonComprar: "Comprar KC Basic",
    botonPremium: "Quiero Premium",
    mensajePremium: "Hola KC Digital Magic, quiero más información sobre las invitaciones Premium.",
    demosBase: "https://basic.kcdigitalmagic.com/"
  },

  /* ---------- 2. SEO (lo que ve Google) ---------- */
  seo: {
    titulo: "Invitaciones digitales de XV años y bodas | KC Digital Magic",
    descripcion: "Invitaciones web para XV años y bodas. KC Basic lista en 24 a 48 horas desde 79.000 COP, o KC Premium diseñada a tu medida con tablero de invitados. Colombia, México, España y EE. UU.",
    url: "https://kcdigitalmagic.com/",
    imagenCompartir: "img/og-compartir.jpg"       // imagen al compartir el enlace (1200x630)
  },

  /* ---------- 3. MENÚ ---------- */
  menu: [
    { texto: "Diseños",       enlace: "#demos" },
    { texto: "Cómo funciona", enlace: "#como-funciona" },
    { texto: "Precios",       enlace: "#precio" },
    { texto: "Preguntas",     enlace: "#preguntas" }
  ],
  botonMenu: "Comprar Basic",

  /* ---------- 4. PORTADA (HERO) ---------- */
  hero: {
    titulo: "Tu evento empieza cuando",
    tituloDestacado: "abren tu invitación.",      // sale en cursiva y color
    subtitulo: "Invitaciones web para XV años y bodas. Elige KC Basic y tenla lista en 24 a 48 horas, o KC Premium, diseñada a tu medida con un tablero para saber quién viene.",
    botonPrincipal: "Comprar KC Basic",
    botonSecundario: "Quiero Premium",           // va a WhatsApp con el mensaje de Premium
    enlaceDemos: "Mira los diseños",
    notas: ["Lista en 24 a 48 horas", "Se abre desde WhatsApp", "Sin descargar apps"],
    // Maqueta del celular con el sobre y del tablero (textos de ejemplo)
    maqueta: {
      tablero: "XV de Valentina", confirmados: 132, deTotal: 160,
      adultos: [84, 100], jovenes: [36, 40], ninos: [12, 20],
      ultima: "Familia Gómez", ultimaDetalle: "confirmó 4 pases",
      sobrePara: "Familia Rodríguez", sobrePases: "4 pases",
      cartaEtiqueta: "Mis XV años", cartaNombre: "Valentina",
      cartaFecha: "Sábado 14 · marzo · 2027", cartaBoton: "Confirmar asistencia"
    }
  },

  /* ---------- 5. DEMOS ---------- */
  demos: {
    titulo: "Mira cómo se ve",
    texto: "Ábrelas en tu celular, como las verán tus invitados. Las de KC Basic las compras y llenas hoy; las Premium se diseñan contigo desde cero.",
    pestanas: [
      { id: "basic", texto: "KC Basic" },
      { id: "xv", texto: "Premium XV" },
      { id: "boda", texto: "Premium bodas" }
    ],
    botonDemo: "Ábrela en tu celular",
    textoPronto: "Demo pronto",
    /* tipo: "basic", "xv" o "boda". "imagen" = captura real de la demo. */
    lista: [
      { tipo: "basic", etiqueta: "KC Basic · Moderna", titulo: "Noche dorada",
        enlace: "https://basic.kcdigitalmagic.com/xv-ana-2611/?para=Familia%20G%C3%B3mez&cupos=4",
        imagen: "https://basic.kcdigitalmagic.com/capturas/xv-ana-2611.jpg", descripcionImagen: "Invitación de XV años en azul noche y dorado con foto de portada" },
      { tipo: "basic", etiqueta: "KC Basic · Moderna", titulo: "Rosa neón",
        enlace: "https://basic.kcdigitalmagic.com/xv-valentina-fotos-2701/?para=Familia%20G%C3%B3mez&cupos=4",
        imagen: "https://basic.kcdigitalmagic.com/capturas/xv-valentina-fotos-2701.jpg", descripcionImagen: "Invitación de XV años en negro y rosa neón con foto de portada" },
      { tipo: "basic", etiqueta: "KC Basic · Clásica", titulo: "Cielo y plata",
        enlace: "https://basic.kcdigitalmagic.com/xv-isabella-2612/?para=Familia%20G%C3%B3mez&cupos=4",
        imagen: "https://basic.kcdigitalmagic.com/capturas/xv-isabella-2612.jpg", descripcionImagen: "Invitación clásica de XV años en azul cielo, con sobre y sello de lacre" },
      { tipo: "basic", etiqueta: "KC Basic · Clásica · sin fotos", titulo: "Marfil y dorado",
        enlace: "https://basic.kcdigitalmagic.com/xv-mariana-2702/?para=Familia%20G%C3%B3mez",
        imagen: "https://basic.kcdigitalmagic.com/capturas/xv-mariana-2702.jpg", descripcionImagen: "Invitación clásica de XV años en marfil y dorado, con monograma y sin fotos" },
      { tipo: "xv", pronto: true, etiqueta: "Premium · XV años", titulo: "Lila y oro viejo",
        enlace: "https://kcdigitalmagic.com/demos/lila-y-oro-viejo?utm_source=landing&utm_medium=web&utm_campaign=demos&utm_content=xv_lila",
        imagen: "", descripcionImagen: "Demo de invitación de XV años en lila con detalles en oro viejo",
        maqueta: { fondo: "#EFE6F4", texto: "#5B447A", suave: "#6E5A86", linea: "#B8955A",
                   boton: "#8C6BA8", botonTexto: "#FFFFFF", marco: true, circulo: false,
                   arriba: "Mis XV años", nombre: "Sofía", cursiva: true,
                   fecha: "21 · junio · 2027", extra: "", textoBoton: "Confirmar asistencia", botonContorno: false } },
      { tipo: "xv", pronto: true, etiqueta: "Premium · XV años", titulo: "Verde salvia",
        enlace: "https://kcdigitalmagic.com/demos/verde-salvia?utm_source=landing&utm_medium=web&utm_campaign=demos&utm_content=xv_salvia",
        imagen: "", descripcionImagen: "Demo de invitación de XV años en verde salvia",
        maqueta: { fondo: "#E4EADD", texto: "#3E4F39", suave: "#4B5E45", linea: "#7D9173",
                   boton: "#4B5E45", botonTexto: "#3E4F39", marco: false, circulo: true,
                   arriba: "Mis quince", nombre: "Mariana", cursiva: false,
                   fecha: "Sábado 9 de octubre", extra: "", textoBoton: "Ver itinerario", botonContorno: true } },
      { tipo: "boda", pronto: true, etiqueta: "Premium · Boda", titulo: "Boda campestre",
        enlace: "https://kcdigitalmagic.com/demos/boda-campestre?utm_source=landing&utm_medium=web&utm_campaign=demos&utm_content=boda_campestre",
        imagen: "", descripcionImagen: "Demo de invitación de boda campestre en tonos tierra",
        maqueta: { fondo: "#F3EBDD", texto: "#5E4631", suave: "#6B5139", linea: "#B8955A",
                   boton: "#8A6A4A", botonTexto: "#FFFFFF", marco: false, circulo: false,
                   arriba: "Nos casamos", nombre: "Ana|& Luis", cursiva: true,
                   fecha: "4 · diciembre · 2027", extra: "Hacienda El Roble", textoBoton: "Confirmar asistencia", botonContorno: false } },
      { tipo: "boda", pronto: true, etiqueta: "Premium · Boda", titulo: "Negro y champán",
        enlace: "https://kcdigitalmagic.com/demos/negro-y-champan?utm_source=landing&utm_medium=web&utm_campaign=demos&utm_content=boda_negro_champan",
        imagen: "", descripcionImagen: "Demo de invitación de boda en negro y champán",
        maqueta: { fondo: "#1C1B19", texto: "#EDE2CB", suave: "#CDB68A", linea: "#CDB68A",
                   boton: "#CDB68A", botonTexto: "#1C1B19", marco: true, circulo: false,
                   arriba: "Boda", nombre: "Laura|& Andrés", cursiva: false,
                   fecha: "18.09.2027 · 7:00 p. m.", extra: "", textoBoton: "Confirmar asistencia", botonContorno: false } }
    ]
  },

  /* ---------- 6. TABLERO ---------- */
  tablero: {
    etiqueta: "Solo en KC Premium",
    titulo: "La parte que solo ves tú",
    texto: "Mientras tus invitados abren la invitación, cada respuesta llega a tu tablero. Sin perseguir confirmaciones por WhatsApp.",
    puntos: [   // icono: nombre de icono Phosphor (https://phosphoricons.com)
      { icono: "pulse", titulo: "Sabes quién viene, en vivo.", texto: "Adultos, jóvenes y niños, y quién falta por responder." },
      { icono: "ticket", titulo: "Pases por familia: nadie se sale de la lista.", texto: "Cada familia confirma solo los lugares que le diste." },
      { icono: "download-simple", titulo: "Descargas la lista lista para el salón.", texto: "En Excel, para el salón, el catering y la distribución de mesas." }
    ],
    boton: "Prueba el tablero",
    botonEnlace: "https://cgp.pythonanywhere.com/tablero?evento=prueba",
    animacionEnVivo: true,                        // el contador sube solo (true / false)
    maqueta: {
      evento: "XV de Valentina", fecha: "Sábado 14 de marzo", invitados: 160,
      topes: { adultos: 100, jovenes: 40, ninos: 20 },
      inicial: { adultos: 82, jovenes: 34, ninos: 12 },
      ultimas: [
        { n: "Familia Pérez Ruiz", d: "4 pases · 2 adultos, 2 niños", t: "hace 8 min" },
        { n: "Abuela Rosa", d: "1 pase · adulto", t: "hace 20 min" },
        { n: "Primos Castaño", d: "3 pases · jóvenes", t: "hace 1 h" }
      ],
      llegan: [   // confirmaciones que van "llegando" en la animación
        { n: "Familia Gómez", a: 2, j: 1, k: 1, d: "4 pases · 2 adultos, 1 joven, 1 niño" },
        { n: "Tía Marta y Jorge", a: 2, j: 0, k: 0, d: "2 pases · adultos" },
        { n: "Familia Rincón", a: 2, j: 1, k: 0, d: "3 pases · 2 adultos, 1 joven" },
        { n: "Sofi y Dani", a: 0, j: 2, k: 0, d: "2 pases · jóvenes" }
      ]
    }
  },

  /* ---------- 7. TESTIMONIOS ---------- */
  testimonios: {
    mostrar: false,                               // true cuando tengas testimonios reales
    titulo: "Familias que ya lo vivieron",
    eventosAcompanados: "",                       // ej: "35" (vacío = no se muestra el contador)
    textoEventos: "eventos acompañados",
    lista: [
      { imagen: "", ayuda: "Captura de WhatsApp o foto real del evento (con permiso)",
        cita: "[TESTIMONIO REAL] Cita corta de la familia, máximo 25 palabras.",
        nombre: "[Nombre real]", detalle: "[XV años · Ciudad, país]" },
      { imagen: "", ayuda: "Captura de WhatsApp o foto real del evento (con permiso)",
        cita: "[TESTIMONIO REAL] Idealmente sobre el tablero o la tranquilidad de saber quién venía.",
        nombre: "[Nombre real]", detalle: "[Boda · Ciudad, país]" },
      { imagen: "", ayuda: "Captura de WhatsApp o foto real del evento (con permiso)",
        cita: "[TESTIMONIO REAL] Idealmente de una quinceañera o de una familia fuera de Colombia.",
        nombre: "[Nombre real]", detalle: "[XV años · Ciudad, país]" }
    ]
  },

  /* ---------- 8. PRECIO ---------- */
  precio: {
    titulo: "Dos formas de invitar.",
    texto: "KC Basic, lista en 24 a 48 horas y la compras aquí mismo. KC Premium, diseñada contigo desde cero. Sin cobro por invitado en ninguna.",
    pregunta: "¿Dónde es tu evento?",
    paisPorDefecto: "auto",                       // "auto" = adivina por la zona horaria del celular; o co, mx, eu, us
    paises: [   // wc = país que se le pasa a la tienda para cobrar en su moneda
      { id: "co", boton: "Colombia", wc: "CO" },
      { id: "mx", boton: "México", wc: "MX" },
      { id: "eu", boton: "Europa", wc: "ES" },
      { id: "us", boton: "Otro país", wc: "US" }
    ],
    planes: [
      { id: "basic", nombre: "KC Basic", destacado: true, sello: "Cómprala hoy",
        descripcion: "Eliges diseño y color, llenas un formulario y en 24 a 48 horas tienes tu invitación.",
        precios: {
          co: { simbolo: "$", monto: "79.000", moneda: "COP" },
          mx: { simbolo: "$", monto: "399", moneda: "MXN" },
          eu: { simbolo: "US$", monto: "22", moneda: "USD" },
          us: { simbolo: "US$", monto: "22", moneda: "USD" }
        },
        pago: "Pago único al comprar.",
        incluye: ["4 diseños, con o sin fotos", "Confirmación por WhatsApp", "Enlace con el nombre de cada familia", "Mapas y agregar al calendario", "1 ronda de ajustes + 2 cambios", "Solo XV años, por ahora"],
        boton: "Comprar KC Basic", accion: "comprar" },
      { id: "premium", nombre: "KC Premium", destacado: false, sello: "A tu medida",
        descripcion: "Karol diseña tu invitación contigo, con tablero de invitados en vivo y todas las secciones.",
        precios: {
          co: { simbolo: "$", monto: "159.000", moneda: "COP" },
          mx: { simbolo: "$", monto: "999", moneda: "MXN" },
          eu: { simbolo: "€", monto: "49", moneda: "EUR" },
          us: { simbolo: "US$", monto: "59", moneda: "USD" }
        },
        pago: "40% para empezar, 60% cuando te encante.",
        incluye: ["Diseño desde cero, a tu medida", "Tablero de invitados en vivo", "Pases por familia", "Itinerario, música, QR para fotos…", "XV años y bodas", "Te acompañamos hasta el evento"],
        boton: "Quiero Premium", accion: "premium" }
    ],
    notaBoton: "Te responden Karol o Cristhian, no un bot."
  },

  /* ---------- 9. CÓMO FUNCIONA ---------- */
  pasos: {
    titulo: "Cómo funciona",
    texto: "Así va cada opción, de la compra al día del evento.",
    pestanas: { basic: "KC Basic", premium: "KC Premium" },
    basic: [
      { t: "Compras", d: "Pagas KC Basic aquí, en tu moneda." },
      { t: "Formulario", d: "Llenas los datos de tu evento y subes tus fotos si quieres.", destacado: true },
      { t: "Primera versión", d: "En 24 a 48 horas hábiles te la mostramos y hacemos una ronda de ajustes." },
      { t: "La compartes", d: "La envías por WhatsApp; tus invitados confirman desde ahí.", destacado: true }
    ],
    premium: [
      { t: "Hablamos", d: "Nos escribes y nos cuentas tu evento, tu fecha y tu idea." },
      { t: "Propuesta", d: "Te proponemos un estilo y confirmamos el precio, sin sorpresas." },
      { t: "Tu contenido", d: "Nos compartes nombres, fotos, horarios y tu lista de invitados." },
      { t: "Anticipo del 40%", d: "Con el anticipo reservamos tu fecha y empezamos.", destacado: true },
      { t: "Diseño", d: "Karol diseña tu invitación y la ajustamos contigo." },
      { t: "Publicación", d: "Recibes tu invitación lista para enviar y tu acceso al tablero." },
      { t: "Pago final", d: "Pagas el 60% restante cuando la invitación te encanta.", destacado: true },
      { t: "Te acompañamos", d: "Seguimos contigo con cambios y confirmaciones hasta el gran día." }
    ]
  },

  /* ---------- 10. QUÉ PUEDE LLEVAR ---------- */
  secciones: {
    titulo: "Qué puede llevar tu invitación",
    texto: "En KC Premium eliges las secciones que quieras. KC Basic trae las esenciales: confirmación, cuenta regresiva, mapa, vestimenta, regalos, fotos y hashtag.",
    lista: [   // icono = nombre en https://phosphoricons.com
      { icono: "check-circle", texto: "Confirmación de asistencia" },
      { icono: "users-three", texto: "Control de invitados" },
      { icono: "qr-code", texto: "QR para fotos" },
      { icono: "hourglass-medium", texto: "Cuenta regresiva" },
      { icono: "book-open-text", texto: "Nuestra historia" },
      { icono: "images", texto: "Carrusel de fotos" },
      { icono: "playlist", texto: "Lista de canciones compartida" },
      { icono: "music-notes", texto: "Música" },
      { icono: "clock", texto: "Itinerario" },
      { icono: "map-pin", texto: "Mapa" },
      { icono: "dress", texto: "Código de vestimenta" },
      { icono: "gift", texto: "Mesa de regalos" },
      { icono: "handshake", texto: "Padrinos" },
      { icono: "pen-nib", texto: "Dedicatorias" },
      { icono: "hash", texto: "Hashtag del evento" },
      { icono: "whatsapp-logo", texto: "Botón a WhatsApp" },
      { icono: "lightbulb", texto: "¿Otra idea? La hacemos realidad", destacado: true }
    ]
  },

  /* ---------- 11. QUIÉNES SOMOS ---------- */
  equipo: {
    titulo: "Quiénes somos",
    foto: "",                                     // ej: "img/karol-y-cristhian.jpg"
    fotoAyuda: "Foto real de Karol y Cristhian trabajando juntos, luz natural",
    texto: "Somos Karol y Cristhian. Karol diseña contigo: escucha tu idea y la convierte en una invitación que se siente tuya. Cristhian construyó el tablero que ordena cada confirmación, para que sepas en todo momento quién viene. No hacemos invitaciones en serie: te acompañamos hasta el día del evento.",
    personas: [
      { nombre: "Karol", rol: "Dirección creativa · diseña cada invitación" },
      { nombre: "Cristhian", rol: "Desarrollo · creó el tablero de invitados" }
    ]
  },

  /* ---------- 12. PREGUNTAS FRECUENTES ---------- */
  preguntas: {
    titulo: "Preguntas frecuentes",
    lista: [
      { p: "¿Qué diferencia hay entre Basic y Premium?", r: "KC Basic usa uno de nuestros diseños listos: tú eliges estilo y color, llenas un formulario y en 24 a 48 horas la tienes. KC Premium se diseña desde cero contigo e incluye el tablero de invitados, pases por familia, itinerario y todas las secciones que quieras." },
      { p: "¿Cuánto cuesta?", r: "KC Basic: 79.000 COP · 399 MXN · 22 USD, pago único. KC Premium: 159.000 COP · 999 MXN · 49 EUR · 59 USD. No cobramos por invitado." },
      { p: "¿Cuánto tiempo tarda?", r: "KC Basic: 24 a 48 horas hábiles desde que completas el formulario. KC Premium: lo acordamos contigo según tu fecha." },
      { p: "¿Puedo hacer cambios después de enviarla?", r: "Sí. Tu invitación vive en la web: si cambia la hora, el lugar o algún detalle, la actualizamos y tus invitados ven la versión nueva sin que tengas que reenviarla." },
      { p: "¿Mis familiares mayores podrán abrirla?", r: "Sí. Se abre con un toque desde WhatsApp, sin descargar nada ni crear cuentas. Confirmar asistencia toma unos segundos, con botones grandes y letra clara." },
      { p: "¿Cómo digo “sin niños”?", r: "Con los pases por familia. Cada invitación muestra cuántos lugares tiene esa familia y no permite confirmar más. Lo dices con delicadeza, sin explicarlo uno por uno. Si quieres, añadimos una frase amable sobre el evento solo para adultos." },
      { p: "¿Cómo pago?", r: "KC Basic se paga en línea aquí mismo, en tu moneda. En KC Premium empiezas con el 40% y pagas el 60% cuando la invitación te encante; te compartimos los medios de pago de tu país por WhatsApp." },
      { p: "¿Atienden en mi país?", r: "Sí. Acompañamos familias en Colombia, México, España y el resto de Europa, y familias hispanas en EE. UU. Todo se coordina por WhatsApp, en tu horario." },
      { p: "¿Qué tengo que enviarles?", r: "Nombres, fecha, hora y lugar, las fotos que quieras incluir, tu idea de estilo y la lista de invitados. Te enviamos una guía corta para que no se te escape nada." }
    ]
  },

  /* ---------- 13. CIERRE ---------- */
  cierre: {
    titulo: "La magia para tus invitados.",
    tituloDestacado: "La tranquilidad para ti.",
    boton: "Comprar KC Basic",
    botonWhatsapp: "Quiero Premium",
    enlaceExtraTexto: "Descarga gratis el checklist para organizar tus XV",
    enlaceExtra: "https://kcdigitalmagic.com/checklist-xv?utm_source=landing&utm_medium=web&utm_campaign=cierre&utm_content=checklist"
  },

  /* ---------- 14. PIE DE PÁGINA ---------- */
  pie: {
    descripcion: "Invitaciones web para XV años y bodas.",
    legales: [
      { texto: "Términos y condiciones", enlace: "/terminos/" },
      { texto: "Privacidad", enlace: "/privacidad/" },
      { texto: "Cambios y devoluciones", enlace: "/devoluciones/" }
    ],
    tituloContacto: "Contacto",
    tituloSiguenos: "Síguenos",
    tituloPaises: "Dónde acompañamos",
    paises: "Colombia · México · España · EE. UU.",
    copyright: "© 2026 KC Digital Magic"
  }
};
