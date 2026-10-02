import { puntoMasCercanoEnRio } from "./riosTrazos";
import { generarReportesEjemplo } from "./generarReportes";

// Reportes de ejemplo (entre 3 y 20 por río), generados por el script
// generarReportes.js. Son datos ilustrativos para el prototipo — ver README,
// sección "Datos de ejemplo". En producción vendrían de la base de datos
// (Firebase Firestore, por ejemplo).
export const seedReports = generarReportesEjemplo();

// Categorías de tipo de contaminación (con ícono, ver TipoIcon.jsx) que se
// usan tanto en el formulario de reporte como en los filtros del mapa.
export const tiposContaminacion = [
  { id: "neg", label: "Aguas negras" },
  { id: "ind", label: "Contaminación industrial" },
  { id: "bas", label: "Basura doméstica" },
  { id: "pla", label: "Plásticos de un solo uso" },
  { id: "sed", label: "Sedimentos / tierra removida" },
  { id: "agro", label: "Químicos agrícolas" },
  { id: "ace", label: "Aceites e hidrocarburos" },
  { id: "esc", label: "Escombros de construcción" },
  { id: "olo", label: "Mal olor" },
  { id: "fau", label: "Fauna muerta" },
  { id: "otr", label: "Otro" },
];

// Marcas observadas, agrupadas por categoría de industria. Son las marcas que,
// según auditorías de basura ciudadana (brand audits) y prensa local, aparecen
// con más frecuencia en ríos y cauces de Panamá. El formulario permite elegir
// varias, y "Otra marca" cubre cualquiera que no esté en la lista.
export const marcasCategorias = [
  {
    id: "plast",
    label: "Residuos plásticos",
    hint: "Envases y empaques plásticos identificados en el río.",
    brands: ["Coca-Cola", "Pepsi", "Nestlé", "Unilever", "Cervecería Nacional", "Grupo Rey"],
  },
  {
    id: "textil",
    label: "Textil y moda",
    hint: "Restos textiles, tintes o químicos de la industria de la moda.",
    brands: ["Zara (Inditex)", "H&M", "Nike", "Adidas", "Gildan"],
  },
  {
    id: "electro",
    label: "Electrónica",
    hint: "Baterías, cables o componentes electrónicos desechados.",
    brands: ["Samsung", "LG", "Sony", "Duracell", "Energizer"],
  },
  {
    id: "mineria",
    label: "Minería y petróleo",
    hint: "Sedimentos, derrames o residuos de actividad extractiva.",
    brands: ["Minera Panamá", "Petroterminal de Panamá", "Chevron", "Shell", "Esso"],
  },
  {
    id: "alimentos",
    label: "Alimentos y bebidas",
    hint: "Empaques y residuos de productos alimenticios.",
    brands: ["Nestlé", "Café Durán", "Ricomini", "Cervecería Nacional", "Grupo Rey"],
  },
  {
    id: "higiene",
    label: "Higiene y cuidado personal",
    hint: "Envases de productos de limpieza e higiene.",
    brands: ["Colgate-Palmolive", "Unilever", "Kimberly-Clark", "Johnson & Johnson"],
  },
];

// Noticias reales de medios panameños. `color` se usa de fondo mientras carga
// la imagen (o si el medio la retira).
export const noticias = [
  {
    titulo: "De balones hasta neveras: la basura que no llegó al mar",
    fuente: "Panamá América",
    color: "#2f8f6b",
    imagen: "https://www.panamaamerica.com.pa/sites/default/files/imagenes/2026/09/07/barr_0.jpg",
    url: "https://www.panamaamerica.com.pa/sociedad/de-balones-hasta-neveras-la-basura-que-no-llego-al-mar-1266065",
  },
  {
    titulo: "Contaminación y débil fiscalización marcaron la crisis del agua en Azuero",
    fuente: "La Prensa",
    color: "#2f6fa5",
    imagen: "https://www.prensa.com/resizer/v2/IGWQQSVWQ5HV5H6WXF3SKMBWKE.JPG?auth=86ff398a7e2265f181bbae8829bca57e08ad57846a1c62a389fe712285e3a1bd&width=400",
    url: "https://www.prensa.com/sociedad/contaminacion-y-debil-fiscalizacion-marcaron-crisis-del-agua-en-azuero/",
  },
  {
    titulo: "Contaminación del río Caimito amenaza abastecimiento de agua en Panamá Oeste",
    fuente: "TVN Noticias",
    color: "#d64545",
    imagen: "https://static.tvn-2.com/clip/9020620f-89c6-416e-aa29-4ae8a9c1113f_facebook-aspect-ratio_default_0.jpg",
    url: "https://www.tvn-2.com/nacionales/contaminacion-rio-caimito-amenaza-abastecimiento-agua-panama-oeste_1_2237987.html",
  },
  {
    titulo: "Cuando llueve, los ríos hablan: toneladas de basura salen a flote",
    fuente: "La Prensa",
    color: "#8a6d3b",
    imagen: "https://www.prensa.com/resizer/v2/H3SWLQCUIBFLTHZGAS6HZ4TPHI.jpeg?auth=75b6acd03a628b4519a08084a4171ff715e2988e0e8d471b24e2c2f044f4d5e2&width=400",
    url: "https://www.prensa.com/sociedad/cuando-llueve-los-rios-hablan-toneladas-de-basura-salen-a-flote/",
  },
  {
    titulo: "Proyecto Siete Cuencas ampliará la captura de residuos en los ríos que desembocan en la bahía de Panamá",
    fuente: "La Prensa",
    color: "#1f9e8f",
    imagen: "https://www.prensa.com/resizer/v2/75IMOXQ3CFDADN3YSUCIHLR774.JPG?auth=dc9761ac75980f511a4bbc30967b3b659a9398b307dea5f02af25139f410310d&width=400",
    url: "https://www.prensa.com/sociedad/proyecto-siete-cuencas-ampliara-la-captura-de-residuos-en-los-rios-que-desembocan-en-la-bahia-de-panama/",
  },
  {
    titulo: "Ministro de MiAmbiente, preocupado por contaminación de los cuerpos de agua en Panamá",
    fuente: "Panamá América",
    color: "#5b6b7a",
    imagen: "https://www.panamaamerica.com.pa/sites/default/files/imagenes/2025/09/02/basura_contaminacion_rios_0.jpg",
    url: "https://www.panamaamerica.com.pa/sociedad/ministro-de-miambiente-preocupado-por-contaminacion-de-los-cuerpos-de-agua-en-panama",
  },
  {
    titulo: "Denuncian ante el Ministerio Público la contaminación del río Pacora por parte de promotoras inmobiliarias",
    fuente: "TVN Noticias",
    color: "#d64545",
    imagen: "https://static.tvn-2.com/clip/7080fbd2-a67f-4401-809f-7e6341b5b046_facebook-aspect-ratio_default_0.jpg",
    url: "https://www.tvn-2.com/nacionales/diputado-manuel-samaniego-denuncia-contaminacion-rio-pacora-ministerio-publico_1_2199778.html",
  },
  {
    titulo: "Identifican 23 puntos críticos de contaminación en la parte media de la cuenca del río La Villa",
    fuente: "Panamá América",
    color: "#2f6fa5",
    imagen: "https://www.panamaamerica.com.pa/sites/default/files/imagenes/2025/06/06/contaminacion-rio-lavilla_0.jpg",
    url: "https://www.panamaamerica.com.pa/provincias/identifican-23-puntos-criticos-de-contaminacion-en-la-parte-media-de-la-cuenca-del-rio-la",
  },
];

export const comentariosSemilla = [
  { iniciales: "MG", nombre: "María G.", texto: "¿Alguien más vio la toma del IDAAN en Pacora esta semana?", tiempo: "hace 3h" },
  { iniciales: "JR", nombre: "Julio R.", texto: "Reporté cerca de Juan Díaz, ya bajó un poco la basura visible.", tiempo: "hace 1d" },
];

// Ríos conocidos (derivados de los reportes semilla, más algunos de los ríos
// principales del país) para ubicar automáticamente el punto marcado en el
// mapa, ya que el usuario ya no escribe el nombre a mano.
// NOTA: esta lista cubre los ríos más conocidos/reportados, no la red hídrica
// completa de Panamá (ver README, sección "¿Existe un mapa con todos los ríos?").
// El corregimiento es una referencia aproximada (el más cercano al punto
// típico del río), no un límite administrativo oficial verificado.
export const riosConocidos = [
  { rio: "Río Pacora", provincia: "Panamá Este", corregimiento: "Pacora", lat: 9.0865, lng: -79.2725 },
  { rio: "Río La Villa", provincia: "Azuero (Herrera/Los Santos)", corregimiento: "La Villa", lat: 7.7333, lng: -80.55 },
  { rio: "Río Juan Díaz", provincia: "Ciudad de Panamá", corregimiento: "Juan Díaz", lat: 9.0295, lng: -79.4685 },
  { rio: "Río Matasnillo", provincia: "Ciudad de Panamá", corregimiento: "Bella Vista", lat: 8.9824, lng: -79.5199 },
  { rio: "Río Chagres", provincia: "Colón", corregimiento: "Nuevo Chagres", lat: 9.22, lng: -79.85 },
  { rio: "Río Tuira", provincia: "Darién", corregimiento: "Yaviza", lat: 8.05, lng: -77.7 },
  { rio: "Río Bayano", provincia: "Panamá Este", corregimiento: "Chepo", lat: 9.1, lng: -78.9 },
  { rio: "Río Santa María", provincia: "Coclé", corregimiento: "Antón", lat: 8.4, lng: -80.5 },
  { rio: "Río Chiriquí Viejo", provincia: "Chiriquí", corregimiento: "Bugaba", lat: 8.55, lng: -82.75 },
  { rio: "Río Changuinola", provincia: "Bocas del Toro", corregimiento: "Changuinola", lat: 9.35, lng: -82.45 },
];

// Distancia aproximada en grados (suficiente para un prototipo, no usa fórmulas geodésicas).
function distancia(lat1, lng1, lat2, lng2) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

// Si el pin cae cerca (~5 km) del cauce de un río ya conocido, se asocia el
// reporte a ese río; si no, se guarda como punto nuevo pendiente de identificar.
// La distancia se mide contra el trazo completo del río (o contra su punto de
// referencia, si no tenemos el trazo).
export function identificarRio(lat, lng) {
  let masCercano = null;
  let menorDistancia = Infinity;
  for (const r of riosConocidos) {
    const enCauce = puntoMasCercanoEnRio(r.rio, lat, lng);
    const d = enCauce ? enCauce.distancia : distancia(lat, lng, r.lat, r.lng);
    if (d < menorDistancia) {
      menorDistancia = d;
      masCercano = r;
    }
  }
  if (masCercano && menorDistancia < 0.05) {
    return { rio: masCercano.rio, provincia: masCercano.provincia, corregimiento: masCercano.corregimiento };
  }
  return { rio: "Punto sin identificar", provincia: "Por confirmar", corregimiento: "Por confirmar" };
}
