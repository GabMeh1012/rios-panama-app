import { identificarRio } from "./seedReports";

// Información GENERAL de cada río (no derivada de los reportes de la
// comunidad): cuenca hidrográfica, superficie, longitud del río principal,
// vertiente y uso principal del agua.
//
// Número de cuenca, superficie, longitud y vertiente provienen de la tabla de
// cuencas hidrográficas de Panamá de ETESA (Empresa de Transmisión Eléctrica,
// Hidrometeorología). El uso principal es un resumen de lo documentado por
// MiAmbiente, IDAAN, la ACP y prensa nacional. No es una API en tiempo real.
//
// Para cualquier río que no esté aquí, DetalleScreen muestra un aviso honesto
// en vez de inventar cifras.
export const FUENTE_INFO_GENERAL = "ETESA · cuencas hidrográficas de Panamá";

export const infoGeneralRios = {
  "Río Pacora": {
    cuenca: "N.º 146 · Río Pacora",
    superficie: "388 km²",
    longitud: "48 km",
    vertiente: "Pacífico",
    usoPrincipal: "Agua potable para Panamá Este (toma del IDAAN y acueductos rurales) y uso agropecuario",
  },
  "Río La Villa": {
    cuenca: "N.º 128 · Río La Villa",
    superficie: "1,284 km²",
    longitud: "117 km",
    vertiente: "Pacífico",
    usoPrincipal: "Agua potable para Chitré y Los Santos, y riego agropecuario en Azuero",
  },
  "Río Juan Díaz": {
    cuenca: "N.º 144 · Río Juan Díaz y ríos entre el Juan Díaz y el Pacora",
    superficie: "322 km²",
    longitud: "22.5 km",
    vertiente: "Pacífico",
    usoPrincipal: "Drenaje pluvial y urbano del este de la ciudad de Panamá; desemboca en la bahía de Panamá",
  },
  "Río Matasnillo": {
    cuenca: "N.º 142 · Río Matasnillo y ríos entre el Caimito y el Juan Díaz",
    superficie: "383 km²",
    longitud: "6 km",
    vertiente: "Pacífico",
    usoPrincipal: "Drenaje pluvial urbano de la ciudad de Panamá; desemboca en la bahía entre Marbella y Punta Paitilla",
  },
  "Río Chagres": {
    cuenca: "N.º 115 · Río Chagres",
    superficie: "3,338 km²",
    longitud: "125 km",
    vertiente: "Atlántico (Caribe)",
    usoPrincipal: "Alimenta los lagos Alajuela y Gatún: operación del Canal y agua potable de Panamá y Colón",
  },
  "Río Tuira": {
    cuenca: "N.º 156 · Río Tuira",
    superficie: "3,017 km²",
    longitud: "127 km",
    vertiente: "Pacífico",
    usoPrincipal: "Navegación y pesca de las comunidades de Darién; desemboca en el golfo de San Miguel",
  },
  "Río Bayano": {
    cuenca: "N.º 148 · Río Bayano",
    superficie: "4,984 km²",
    longitud: "215 km",
    vertiente: "Pacífico",
    usoPrincipal: "Generación hidroeléctrica (embalse del lago Bayano) y pesca",
  },
  "Río Santa María": {
    cuenca: "N.º 132 · Río Santa María",
    superficie: "3,326 km²",
    longitud: "168 km",
    vertiente: "Pacífico",
    usoPrincipal: "Riego agrícola y agua potable en Veraguas, Coclé y Herrera",
  },
  "Río Chiriquí Viejo": {
    cuenca: "N.º 102 · Río Chiriquí Viejo",
    superficie: "1,376 km²",
    longitud: "161 km",
    vertiente: "Pacífico",
    usoPrincipal: "Generación hidroeléctrica y agricultura en las tierras altas de Chiriquí",
  },
  "Río Changuinola": {
    cuenca: "N.º 91 · Río Changuinola",
    superficie: "3,202 km²",
    longitud: "110 km",
    vertiente: "Atlántico (Caribe)",
    usoPrincipal: "Generación hidroeléctrica (central Changuinola I) en Bocas del Toro",
  },
};

// Devuelve la información general de un reporte. Primero busca por el nombre
// del río; si el nombre no está en la lista (por ejemplo, un nombre escrito a
// mano), usa las coordenadas del reporte para ubicar el río conocido más
// cercano y lo indica con `porUbicacion`, para que la pantalla lo aclare.
export function getInfoGeneral(report) {
  if (infoGeneralRios[report.rio]) {
    return { ...infoGeneralRios[report.rio], rio: report.rio, porUbicacion: false };
  }
  const cercano = identificarRio(report.lat, report.lng).rio;
  if (infoGeneralRios[cercano]) {
    return { ...infoGeneralRios[cercano], rio: cercano, porUbicacion: true };
  }
  return null;
}
