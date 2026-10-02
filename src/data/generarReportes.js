// Script que genera los reportes de EJEMPLO de cada río (entre 3 y 20 por
// río), para que el prototipo tenga datos suficientes que mostrar: mapa,
// tendencia de 30 días, contaminantes más comunes, historial y alertas.
//
// Son datos ILUSTRATIVOS, no reportes reales de vecinos. Lo que sí es real:
//  - Cada punto cae sobre el cauce real del río (ver riosTrazos.js).
//  - La cantidad y gravedad por río sigue lo documentado en prensa y por
//    MiAmbiente: Pacora, La Villa, Juan Díaz y Matasnillo son los más
//    afectados; los demás tienen pocos reportes.
//  - El primer reporte de esos cuatro ríos resume un caso real de prensa.
//
// La generación es determinista (misma semilla -> mismos reportes), así que
// los datos no cambian entre recargas. Las fechas se calculan hacia atrás
// desde hoy, para que la tendencia de 30 días siempre tenga datos el día que
// se abra la app.
import { puntoEnFraccion } from "./riosTrazos";

// Cambia este número cada vez que modifiques los datos de ejemplo: la app
// descarta lo guardado en el navegador y carga los datos nuevos (ver
// useReports.js).
export const VERSION_DATOS = 2;

// total: reportes del río · recientes: cuántos caen en los últimos 30 días ·
// severidad: probabilidad de [crítico, moderado] (el resto es leve) ·
// tipos: tipos de contaminación más probables en ese río (los repetidos pesan más).
const configRios = [
  {
    rio: "Río Pacora",
    provincia: "Panamá Este",
    corregimiento: "Pacora",
    total: 20,
    recientes: 11,
    severidad: [0.45, 0.35],
    tipos: ["Aguas negras", "Aguas negras", "Aguas negras", "Basura doméstica", "Plásticos de un solo uso", "Mal olor", "Sedimentos / tierra removida"],
    destacado: {
      tipo: "Aguas negras",
      severidad: "critico",
      descripcion:
        "Agua con color oscuro cerca de la toma del IDAAN. Comunidad reporta afluentes Utivé, Indio y San Miguel contaminados por porquerizas y basura.",
    },
  },
  {
    rio: "Río La Villa",
    provincia: "Azuero (Herrera/Los Santos)",
    corregimiento: "La Villa",
    total: 16,
    recientes: 7,
    severidad: [0.4, 0.4],
    tipos: ["Contaminación industrial", "Contaminación industrial", "Químicos agrícolas", "Químicos agrícolas", "Aguas negras", "Mal olor", "Fauna muerta"],
    destacado: {
      tipo: "Contaminación industrial",
      severidad: "critico",
      descripcion:
        "Metales pesados y vinaza afectando la potabilización. Idaan suspendió plantas potabilizadoras en la zona.",
    },
  },
  {
    rio: "Río Juan Díaz",
    provincia: "Ciudad de Panamá",
    corregimiento: "Juan Díaz",
    total: 14,
    recientes: 6,
    severidad: [0.25, 0.5],
    tipos: ["Plásticos de un solo uso", "Plásticos de un solo uso", "Basura doméstica", "Basura doméstica", "Aguas negras", "Escombros de construcción", "Aceites e hidrocarburos"],
    destacado: {
      tipo: "Plásticos de un solo uso",
      severidad: "moderado",
      descripcion: "Acumulación de desechos sólidos flotantes en el cauce urbano, cerca de la desembocadura.",
    },
  },
  {
    rio: "Río Matasnillo",
    provincia: "Ciudad de Panamá",
    corregimiento: "Bella Vista",
    total: 12,
    recientes: 5,
    severidad: [0.25, 0.5],
    tipos: ["Aguas negras", "Aguas negras", "Aceites e hidrocarburos", "Basura doméstica", "Sedimentos / tierra removida", "Mal olor"],
    destacado: {
      tipo: "Aguas negras",
      severidad: "moderado",
      descripcion: "Descargas de aguas residuales urbanas en la subcuenca de Betania.",
    },
  },
  {
    rio: "Río Chagres",
    provincia: "Colón",
    corregimiento: "Nuevo Chagres",
    total: 6,
    recientes: 2,
    severidad: [0.1, 0.4],
    tipos: ["Basura doméstica", "Plásticos de un solo uso", "Sedimentos / tierra removida", "Aguas negras"],
  },
  {
    rio: "Río Santa María",
    provincia: "Coclé",
    corregimiento: "Antón",
    total: 6,
    recientes: 2,
    severidad: [0.1, 0.45],
    tipos: ["Químicos agrícolas", "Químicos agrícolas", "Sedimentos / tierra removida", "Basura doméstica"],
  },
  {
    rio: "Río Chiriquí Viejo",
    provincia: "Chiriquí",
    corregimiento: "Bugaba",
    total: 5,
    recientes: 2,
    severidad: [0.1, 0.4],
    tipos: ["Químicos agrícolas", "Químicos agrícolas", "Sedimentos / tierra removida", "Basura doméstica"],
  },
  {
    rio: "Río Bayano",
    provincia: "Panamá Este",
    corregimiento: "Chepo",
    total: 4,
    recientes: 1,
    severidad: [0.05, 0.4],
    tipos: ["Sedimentos / tierra removida", "Basura doméstica", "Químicos agrícolas"],
  },
  {
    rio: "Río Changuinola",
    provincia: "Bocas del Toro",
    corregimiento: "Changuinola",
    total: 4,
    recientes: 1,
    severidad: [0.05, 0.4],
    tipos: ["Químicos agrícolas", "Plásticos de un solo uso", "Basura doméstica"],
  },
  {
    rio: "Río Tuira",
    provincia: "Darién",
    corregimiento: "Yaviza",
    total: 3,
    recientes: 1,
    severidad: [0.05, 0.3],
    tipos: ["Sedimentos / tierra removida", "Basura doméstica", "Aceites e hidrocarburos"],
  },
];

const descripciones = {
  "Aguas negras": [
    "Descarga de aguas residuales sin tratar directamente al cauce.",
    "Agua oscura con espuma y olor fuerte en este tramo.",
    "Tubería vertiendo aguas servidas al río.",
  ],
  "Contaminación industrial": [
    "Vertido con olor químico y coloración inusual del agua.",
    "Descarga de una instalación cercana; el agua cambia de color en este punto.",
    "Residuos líquidos con espuma densa saliendo de una tubería.",
  ],
  "Basura doméstica": [
    "Bolsas de basura acumuladas en la orilla.",
    "Desechos domésticos arrastrados por la corriente tras la lluvia.",
    "Vertedero improvisado a un costado del río.",
  ],
  "Plásticos de un solo uso": [
    "Botellas y envases plásticos flotando en el cauce.",
    "Envases plásticos varados en la orilla tras la lluvia.",
    "Bolsas y recipientes de foam atrapados entre la vegetación.",
  ],
  "Sedimentos / tierra removida": [
    "Agua turbia por tierra removida aguas arriba.",
    "Sedimento cubriendo el fondo del río por movimiento de tierra cercano.",
    "Erosión de la orilla; el agua baja de color chocolate.",
  ],
  "Químicos agrícolas": [
    "Envases de agroquímicos tirados cerca de la orilla.",
    "Escorrentía de un cultivo cercano llega directo al río.",
    "Espuma y olor a químico tras una fumigación en la zona.",
  ],
  "Aceites e hidrocarburos": [
    "Capa de aceite visible sobre la superficie del agua.",
    "Mancha iridiscente y olor a combustible en este tramo.",
    "Residuos de aceite llegando por un drenaje pluvial.",
  ],
  "Escombros de construcción": [
    "Restos de concreto y caliche arrojados a la orilla.",
    "Escombros de una obra cercana obstruyen parte del cauce.",
  ],
  "Mal olor": [
    "Olor fuerte y persistente reportado por vecinos.",
    "Mal olor constante, más intenso al mediodía.",
  ],
  "Fauna muerta": [
    "Peces muertos flotando cerca de la orilla.",
    "Varios peces muertos en un remanso del río.",
  ],
};

const marcasPlastico = ["Coca-Cola", "Pepsi", "Nestlé", "Cervecería Nacional", "Grupo Rey"];

// Generador pseudoaleatorio con semilla (mulberry32): siempre da la misma
// secuencia para el mismo río.
function crearAzar(semilla) {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function semillaDe(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (Math.imul(h, 31) + texto.charCodeAt(i)) | 0;
  return h;
}

function fechaHaceDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString().slice(0, 10);
}

function generarDelRio(cfg, indiceRio) {
  const azar = crearAzar(semillaDe(cfg.rio));
  const elegir = (lista) => lista[Math.floor(azar() * lista.length)];
  const reportes = [];

  for (let i = 0; i < cfg.total; i++) {
    const esReciente = i < cfg.recientes;
    // Recientes: últimos 30 días. El resto: entre 1 y 4 meses atrás.
    const dias = esReciente ? Math.floor(azar() * 29) : 31 + Math.floor(azar() * 90);
    const esDestacado = i === 0 && cfg.destacado;

    const tipo = esDestacado ? cfg.destacado.tipo : elegir(cfg.tipos);
    const s = azar();
    let severidad = "leve";
    if (s < cfg.severidad[0]) severidad = "critico";
    else if (s < cfg.severidad[0] + cfg.severidad[1]) severidad = "moderado";
    if (esDestacado) severidad = cfg.destacado.severidad;

    // Los reportes viejos casi siempre ya fueron atendidos; los recientes
    // siguen abiertos.
    let estado = azar() < 0.55 ? "nuevo" : "en revisión";
    if (!esReciente) estado = azar() < 0.8 ? "atendido" : "en revisión";

    const base = { critico: 6, moderado: 3, leve: 1 }[severidad];
    const punto = puntoEnFraccion(cfg.rio, azar());

    const reporte = {
      id: `ej${indiceRio}-${i}`,
      rio: cfg.rio,
      provincia: cfg.provincia,
      corregimiento: cfg.corregimiento,
      lat: punto.lat,
      lng: punto.lng,
      tipo,
      severidad,
      descripcion: esDestacado ? cfg.destacado.descripcion : elegir(descripciones[tipo]),
      fecha: fechaHaceDias(dias),
      confirmaciones: base + Math.floor(azar() * 5),
      estado,
    };

    const esPlastico = tipo === "Plásticos de un solo uso" || tipo === "Basura doméstica";
    if (esPlastico && azar() < 0.45) {
      reporte.marcas = [elegir(marcasPlastico)];
    }
    reportes.push(reporte);
  }
  return reportes;
}

export function generarReportesEjemplo() {
  return configRios
    .flatMap((cfg, i) => generarDelRio(cfg, i))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}
