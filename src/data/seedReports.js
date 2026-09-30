// Reportes de ejemplo, basados en casos reales documentados en prensa panameña.
// En producción, estos vendrían de la base de datos (Firebase Firestore, por ejemplo).
export const seedReports = [
  {
    id: "r1",
    rio: "Río Pacora",
    provincia: "Panamá Este",
    lat: 9.0865,
    lng: -79.2725,
    tipo: "Aguas negras",
    severidad: "critico",
    descripcion:
      "Agua con color oscuro cerca de la toma del IDAAN. Comunidad reporta afluentes Utivé, Indio y San Miguel contaminados por porquerizas y basura.",
    fecha: "2026-08-20",
    confirmaciones: 7,
    estado: "en revisión",
  },
  {
    id: "r1b",
    rio: "Río Pacora",
    provincia: "Panamá Este",
    lat: 9.087,
    lng: -79.271,
    tipo: "Basura doméstica",
    severidad: "moderado",
    descripcion: "Basura acumulada en la orilla, cerca del puente principal.",
    fecha: "2026-08-05",
    confirmaciones: 3,
    estado: "nuevo",
  },
  {
    id: "r1c",
    rio: "Río Pacora",
    provincia: "Panamá Este",
    lat: 9.086,
    lng: -79.273,
    tipo: "Aguas negras",
    severidad: "moderado",
    descripcion: "Olor fuerte y espuma en la superficie del agua.",
    fecha: "2026-07-12",
    confirmaciones: 5,
    estado: "atendido",
  },
  {
    id: "r1d",
    rio: "Río Pacora",
    provincia: "Panamá Este",
    lat: 9.088,
    lng: -79.27,
    tipo: "Aceites e hidrocarburos",
    severidad: "leve",
    descripcion: "Ligera capa de aceite visible tras la lluvia.",
    fecha: "2026-06-18",
    confirmaciones: 1,
    estado: "atendido",
  },
  {
    id: "r2",
    rio: "Río La Villa",
    provincia: "Azuero (Herrera/Los Santos)",
    lat: 7.7333,
    lng: -80.55,
    tipo: "Contaminación industrial",
    severidad: "critico",
    descripcion:
      "Metales pesados y vinaza afectando la potabilización. Idaan suspendió plantas potabilizadoras en la zona.",
    fecha: "2026-06-01",
    confirmaciones: 12,
    estado: "atendido",
    marcas: ["Ingenio azucarero local"],
  },
  {
    id: "r3",
    rio: "Río Juan Díaz",
    provincia: "Ciudad de Panamá",
    lat: 9.0295,
    lng: -79.4685,
    tipo: "Plásticos de un solo uso",
    severidad: "moderado",
    descripcion:
      "Acumulación de desechos sólidos flotantes en el cauce urbano, cerca de la desembocadura.",
    fecha: "2026-08-10",
    confirmaciones: 4,
    estado: "nuevo",
    marcas: ["Coca-Cola", "Cervecería Nacional"],
  },
  {
    id: "r4",
    rio: "Río Matasnillo",
    provincia: "Ciudad de Panamá",
    lat: 8.9824,
    lng: -79.5199,
    tipo: "Aguas negras",
    severidad: "moderado",
    descripcion: "Descargas de aguas residuales urbanas en la subcuenca de Betania.",
    fecha: "2026-07-15",
    confirmaciones: 2,
    estado: "nuevo",
  },
];

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

export const noticias = [
  {
    titulo: "Crisis de agua en La Villa y Estibaná",
    fuente: "TVN Noticias",
    color: "#2f6fa5",
  },
  {
    titulo: "Contaminación del Pacora arriesga a 400 mil personas",
    fuente: "EcoTV Panamá",
    color: "#d64545",
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
export const riosConocidos = [
  { rio: "Río Pacora", provincia: "Panamá Este", lat: 9.0865, lng: -79.2725 },
  { rio: "Río La Villa", provincia: "Azuero (Herrera/Los Santos)", lat: 7.7333, lng: -80.55 },
  { rio: "Río Juan Díaz", provincia: "Ciudad de Panamá", lat: 9.0295, lng: -79.4685 },
  { rio: "Río Matasnillo", provincia: "Ciudad de Panamá", lat: 8.9824, lng: -79.5199 },
  { rio: "Río Chagres", provincia: "Colón", lat: 9.22, lng: -79.85 },
  { rio: "Río Tuira", provincia: "Darién", lat: 8.05, lng: -77.7 },
  { rio: "Río Bayano", provincia: "Panamá Este", lat: 9.1, lng: -78.9 },
  { rio: "Río Santa María", provincia: "Coclé", lat: 8.4, lng: -80.5 },
  { rio: "Río Chiriquí Viejo", provincia: "Chiriquí", lat: 8.55, lng: -82.75 },
  { rio: "Río Changuinola", provincia: "Bocas del Toro", lat: 9.35, lng: -82.45 },
];

// Distancia aproximada en grados (suficiente para un prototipo, no usa fórmulas geodésicas).
function distancia(lat1, lng1, lat2, lng2) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

// Si el pin cae cerca (~5 km) de un río ya conocido, se asocia el reporte a ese río;
// si no, se guarda como punto nuevo pendiente de identificar.
export function identificarRio(lat, lng) {
  let masCercano = null;
  let menorDistancia = Infinity;
  for (const r of riosConocidos) {
    const d = distancia(lat, lng, r.lat, r.lng);
    if (d < menorDistancia) {
      menorDistancia = d;
      masCercano = r;
    }
  }
  if (masCercano && menorDistancia < 0.05) {
    return { rio: masCercano.rio, provincia: masCercano.provincia };
  }
  return { rio: "Punto sin identificar", provincia: "Por confirmar" };
}
