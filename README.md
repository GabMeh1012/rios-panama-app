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
  o más reportes, se muestra la alerta en el detalle (ver useReports.js,
  función tieneFocoCritico).

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

- El río Pacora tiene más reportes de ejemplo (`src/data/seedReports.js`) que
  los demás a propósito, distribuidos en los últimos 30 días, para poder
  mostrar completa la pantalla de detalle (tendencia, contaminantes más
  comunes, historial) con datos reales calculados de verdad — no cifras
  inventadas puestas a mano.
- `src/data/riosInfo.js` tiene la "información general" de cada río (cuenca,
  longitud aproximada, uso principal, última inspección oficial). Esto es
  investigación propia para el prototipo, no una API oficial en tiempo real,
  así que son aproximados. Si un río no está en esa lista, la pantalla de
  detalle lo dice honestamente en vez de inventar los datos.
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
