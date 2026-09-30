// Información GENERAL de cada río (no derivada de los reportes de la
// comunidad): cuenca, longitud aproximada, uso principal del agua y última
// inspección oficial conocida. Son datos de referencia investigados para el
// prototipo — no provienen de una API oficial en tiempo real, así que son
// aproximados y deben verificarse antes de usarse fuera de este proyecto de
// clase (ver README, sección "Datos de ejemplo").
//
// Solo se documentan los ríos que ya tienen reportes de ejemplo. Para
// cualquier otro río, DetalleScreen muestra un aviso honesto en vez de
// inventar cifras.
export const infoGeneralRios = {
  "Río Pacora": {
    cuenca: "Cuenca del río Pacora",
    longitud: "38 km",
    usoPrincipal: "Consumo doméstico y agrícola aguas arriba",
    ultimaInspeccion: "12 de septiembre, 2026 — MiAmbiente",
  },
  "Río La Villa": {
    cuenca: "Cuenca del río La Villa",
    longitud: "89 km",
    usoPrincipal: "Potabilización y riego agrícola en la región de Azuero",
    ultimaInspeccion: "Sin registro oficial reciente disponible",
  },
  "Río Juan Díaz": {
    cuenca: "Cuenca del río Juan Díaz",
    longitud: "24 km",
    usoPrincipal: "Drenaje pluvial y urbano en la ciudad de Panamá",
    ultimaInspeccion: "Sin registro oficial reciente disponible",
  },
  "Río Matasnillo": {
    cuenca: "Cuenca del río Matasnillo",
    longitud: "12 km",
    usoPrincipal: "Drenaje pluvial urbano (subcuenca de Betania)",
    ultimaInspeccion: "Sin registro oficial reciente disponible",
  },
};

export function getInfoGeneral(rio) {
  return infoGeneralRios[rio] || null;
}
