# Ríos PTY — Prototipo de monitoreo ciudadano

Prototipo funcional en React (Vite) de la app de monitoreo ciudadano de ríos en
Panamá. Tiene 3 pantallas: mapa colaborativo, nuevo reporte (foto + GPS) y
detalle de reporte con alerta automática.

## Requisitos

- Visual Studio Code (https://code.visualstudio.com/)
- Node.js version 18 o superior (incluye npm) (https://nodejs.org/)

## Cómo correrlo en VS Code

1. Descomprime esta carpeta y ábrela en VS Code: Archivo > Abrir carpeta...
2. Abre una terminal integrada: Terminal > Nueva terminal (o Ctrl+ñ)
3. Instala las dependencias:
   npm install
4. Corre el servidor de desarrollo:
   npm run dev
5. Abre la URL que aparece en la terminal (normalmente http://localhost:5173)
   en tu navegador. Para probar la cámara y el GPS reales, ábrelo desde el
   navegador de tu celular conectado a la misma red (usa la URL "Network" que
   te muestra la terminal).

Extensiones recomendadas en VS Code: ES7+ React/Redux/React-Native snippets
y Prettier (formateo automático).

## Estructura del proyecto

src/
  App.jsx                     Navegación entre las 3 pantallas
  index.css                   Estilos globales
  data/
    seedReports.js            Reportes de ejemplo (ríos reales investigados)
    useReports.js             "Base de datos" simulada con localStorage
  components/
    MapaScreen.jsx             Mapa colaborativo (Leaflet) + lista de reportes
    NuevoReporteScreen.jsx      Formulario: foto, GPS, tipo, severidad
    DetalleScreen.jsx           Detalle + alerta de foco crítico

## Cómo funciona ahora mismo

- Los reportes se guardan en localStorage del navegador (no hay backend
  real). Esto es suficiente para una demostración de prototipo.
- La foto se toma con el input de archivo del navegador
  (input type="file" capture="environment"), que en celulares abre la
  cámara directamente.
- La ubicación usa la API navigator.geolocation del navegador. Si el
  usuario no da permiso, se usa una coordenada simulada para que el flujo no
  se rompa.
- La "alerta de foco crítico" es una regla simple: si un mismo río acumula 3
  o más reportes activos (sin atender y de los últimos 30 días), se muestra
  la alerta en el detalle y en la campanita (ver useReports.js, función
  riosConFocoCritico).

## Conectar Firebase (siguiente paso, opcional)

Para que los reportes se compartan entre usuarios de verdad, reemplaza
localStorage por Firebase:

1. Crea un proyecto gratis en https://console.firebase.google.com
2. Instala el SDK: npm install firebase
3. Crea src/firebase.js con tu configuración (firebaseConfig) y
   exporta getFirestore(app) y getStorage(app)
4. En useReports.js, reemplaza las funciones de localStorage por:
   - addDoc(collection(db, "reportes"), datos) para guardar
   - onSnapshot(collection(db, "reportes"), ...) para leer en tiempo real
   - uploadBytes de Firebase Storage para subir la foto antes de guardar el
     reporte

## ¿Existe un mapa con todos los ríos de Panamá?

Sí, hay un par de fuentes reales, pero ninguna es un "botón mágico" que ya
venga cargado en Leaflet:

- **OpenStreetMap / Overpass API** — tiene mapeados la mayoría de los ríos y
  quebradas de Panamá (los que la comunidad de OSM ha trazado). Es gratis y
  se puede consultar en vivo desde el navegador del usuario (no necesita API
  key), pero para traer "todos los ríos" de una vez hay que hacer una
  consulta Overpass por bounding box y luego dibujar el resultado como
  polilíneas en Leaflet. Es la opción más viable para ampliar esto a futuro.
- **HydroRIVERS / HydroSHEDS (WWF)** — el dataset hidrográfico más completo
  a nivel mundial, incluye Panamá, pero viene en shapefile/GeoPackage y hay
  que descargarlo, recortarlo al país y convertirlo a GeoJSON con QGIS o
  `ogr2ogr` antes de poder usarlo en la web.
- **ANAM / Instituto Geográfico Nacional Tommy Guardia (IGNTG)** — la fuente
  oficial de cuencas hidrográficas de Panamá, pero se distribuye como capas
  de su Geoportal, no como una API lista para consumir desde una app.

Para este prototipo, **no** se cargó la red hídrica completa del país (son
miles de quebradas y sería mucho peso para una app móvil de clase). En su
lugar:

- `src/data/seedReports.js` tiene una lista ampliada de los ríos más
  conocidos/reportados (`riosConocidos`), usada para autodetectar el nombre
  del río según la ubicación GPS del usuario.
- `src/data/panamaZonas.js` tiene un rectángulo aproximado por provincia
  (**no son límites administrativos oficiales**, son solo una referencia
  visual) que se dibuja sobre el mapa cuando se toca un filtro de "Zona", así
  el mapa "marca" la zona igual que en el wireframe.

Si más adelante quieres el mapa completo de ríos, lo más práctico es agregar
una consulta a Overpass API (`waterway=river` dentro del bounding box de
Panamá) y dibujar el `GeoJSON` resultante con el componente `<GeoJSON>` de
react-leaflet.

## Datos de ejemplo

- Los reportes de ejemplo los genera el script `src/data/generarReportes.js`
  (entre 3 y 20 por río, 90 en total). Son datos **ilustrativos**, no
  reportes reales de vecinos: sirven para mostrar completas las pantallas
  (mapa, tendencia, contaminantes más comunes, historial, alertas). La
  cantidad y gravedad por río sigue lo documentado en prensa (Pacora, La
  Villa, Juan Díaz y Matasnillo son los más afectados), cada punto cae sobre
  el cauce real del río y las fechas se calculan hacia atrás desde el día en
  que se abre la app.
- Para cambiar los datos de ejemplo, edita `configRios` en ese archivo y sube
  `VERSION_DATOS`: la app descarta lo guardado en el navegador y carga los
  datos nuevos (esto también borra los reportes creados en ese dispositivo).
- `src/data/riosTrazos.json` tiene el cauce de cada río conocido, tomado de
  OpenStreetMap (© colaboradores de OpenStreetMap, ODbL), para dibujarlo en
  azul en el mapa.
- `src/data/riosInfo.js` tiene la "información general" de cada río (cuenca,
  superficie, longitud, vertiente, uso principal), tomada de la tabla de
  cuencas hidrográficas de ETESA. No es una API oficial en tiempo real. Si
  un río no está en esa lista, la pantalla de detalle lo dice honestamente
  en vez de inventar los datos.
- El "corregimiento" de cada río (`riosConocidos` en `seedReports.js`) es una
  referencia aproximada al corregimiento más cercano, no un límite
  administrativo oficial verificado — igual que las zonas del mapa
  (`panamaZonas.js`).

## Notas

- El mapa usa Leaflet con tiles de OpenStreetMap (gratis, sin API key).
  Si prefieres Google Maps, la librería @react-google-maps/api es el
  equivalente, pero requiere una API key de Google Cloud.
- Todo el código está comentado en español pensando en que lo sustentes en clase.
- La paleta, tipografías (Fraunces + Figtree) e íconos siguen el wireframe de
  diseño de Ríos PTY (azul-verde, tarjetas con ícono, marcas observadas por
  categoría).
