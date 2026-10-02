// Trazo real del cauce de cada río conocido, para dibujarlo en azul sobre el
// mapa. Cada río es una lista de tramos, y cada tramo una lista de [lat, lng].
// Los datos vienen de OpenStreetMap (© colaboradores de OpenStreetMap, licencia
// ODbL), simplificados para que pesen poco. El río Chagres aparece en dos
// partes porque en medio atraviesa el lago Gatún.
import trazos from "./riosTrazos.json";

export const riosTrazos = trazos;
export const COLOR_RIO = "#1d6fd1";

// Punto del cauce ubicado a cierta fracción (0 a 1) del recorrido del río,
// contando por vértices del trazo. Sirve para repartir los reportes de
// ejemplo a lo largo del río.
export function puntoEnFraccion(rio, fraccion) {
  const vertices = (trazos[rio] || []).flat();
  if (vertices.length === 0) return null;
  const [lat, lng] = vertices[Math.min(vertices.length - 1, Math.floor(fraccion * vertices.length))];
  return { lat, lng };
}

// Punto del cauce más cercano a (lat, lng) y su distancia aproximada en
// grados. Devuelve null si no tenemos el trazo de ese río.
export function puntoMasCercanoEnRio(rio, lat, lng) {
  const tramos = trazos[rio];
  if (!tramos) return null;
  let mejor = null;
  for (const tramo of tramos) {
    for (let i = 0; i < tramo.length - 1; i++) {
      const [aLat, aLng] = tramo[i];
      const dLat = tramo[i + 1][0] - aLat;
      const dLng = tramo[i + 1][1] - aLng;
      const largo = dLat * dLat + dLng * dLng;
      const t = largo ? Math.max(0, Math.min(1, ((lat - aLat) * dLat + (lng - aLng) * dLng) / largo)) : 0;
      const pLat = aLat + t * dLat;
      const pLng = aLng + t * dLng;
      const distancia = Math.hypot(pLat - lat, pLng - lng);
      if (!mejor || distancia < mejor.distancia) {
        mejor = { lat: pLat, lng: pLng, distancia };
      }
    }
  }
  return mejor;
}
