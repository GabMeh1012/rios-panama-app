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

## Notas

- El mapa usa Leaflet con tiles de OpenStreetMap (gratis, sin API key).
  Si prefieres Google Maps, la librería @react-google-maps/api es el
  equivalente, pero requiere una API key de Google Cloud.
- Todo el código está comentado en español pensando en que lo sustentes en clase.
