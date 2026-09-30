// Zonas (provincias/comarcas) para el filtro del mapa, con un rectángulo
// aproximado de referencia para "marcar" la zona seleccionada sobre el mapa.
//
// IMPORTANTE: estos son rectángulos aproximados dibujados a mano para el
// prototipo (suficientes para resaltar visualmente "más o menos dónde" está
// cada provincia). No son límites administrativos oficiales. Para límites
// reales, lo correcto es usar un GeoJSON oficial — ver README, sección
// "¿Existe un mapa con todos los ríos de Panamá?".
export const zonas = [
  "Todas",
  "Bocas del Toro",
  "Chiriquí",
  "Veraguas",
  "Coclé",
  "Azuero",
  "Colón",
  "Ciudad de Panamá",
  "Panamá Este",
  "Darién",
];

// bounds en formato Leaflet: [[sur, oeste], [norte, este]]
export const zonasMapa = {
  "Bocas del Toro": { bounds: [[8.7, -83.05], [9.6, -81.4]], color: "#2f6fa5" },
  "Chiriquí": { bounds: [[8.0, -83.05], [8.9, -81.7]], color: "#1f7a6c" },
  "Veraguas": { bounds: [[7.2, -81.9], [8.7, -80.85]], color: "#14b8a6" },
  "Coclé": { bounds: [[8.2, -80.85], [8.9, -80.1]], color: "#2f9e63" },
  "Azuero": { bounds: [[7.15, -80.9], [7.95, -79.9]], color: "#e0a52c" },
  "Colón": { bounds: [[8.95, -80.3], [9.6, -79.5]], color: "#0a3d47" },
  "Ciudad de Panamá": { bounds: [[8.85, -79.65], [9.15, -79.3]], color: "#d64545" },
  "Panamá Este": { bounds: [[8.6, -79.3], [9.3, -78.15]], color: "#8a5a12" },
  "Darién": { bounds: [[7.2, -78.15], [8.9, -77.15]], color: "#5b7370" },
};
