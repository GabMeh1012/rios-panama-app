import { useState } from "react";
import { useReports, riosConFocoCritico } from "./data/useReports";
import { comentariosSemilla } from "./data/seedReports";
import MapaScreen from "./components/MapaScreen";
import NuevoReporteScreen from "./components/NuevoReporteScreen";
import DetalleScreen from "./components/DetalleScreen";
import LoginScreen from "./components/LoginScreen";
import PerfilScreen from "./components/PerfilScreen";
import RiosScreen from "./components/RiosScreen";
import AppHeader from "./components/AppHeader";
import BottomNav from "./components/BottomNav";

// Pantallas que tienen su propia barra superior/inferior tipo "tab bar"
// (Inicio, Mapa, Comunidad y Perfil comparten la misma pantalla de mapa por
// ahora, salvo Perfil que es su propia vista).
const PANTALLAS_CON_NAV = ["mapa", "rios", "perfil"];

export default function App() {
  const {
    reports,
    pendientes,
    online,
    addReport,
    tieneFocoCritico,
    escalarReporte,
    confirmados,
    alternarConfirmacion,
    tendenciaUltimos30Dias,
  } = useReports();
  const [pantalla, setPantalla] = useState("mapa"); // "mapa" | "rios" | "nuevo" | "detalle" | "login" | "perfil"
  const [seleccionado, setSeleccionado] = useState(null);
  const [volverA, setVolverA] = useState("mapa"); // pantalla a la que regresa la flecha del detalle
  const [usuario, setUsuario] = useState(null);
  const [comentarios, setComentarios] = useState(comentariosSemilla);
  const [destinoPendiente, setDestinoPendiente] = useState(null); // a dónde ir después de iniciar sesión
  const [vista, setVista] = useState("inicio"); // "inicio" | "mapa" | "comunidad" (scroll dentro de MapaScreen)
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [alertasAbiertas, setAlertasAbiertas] = useState(false);

  // Ríos con foco crítico (3+ reportes activos), para las alertas reales de
  // la campanita del header — no son alertas inventadas.
  const riosCriticos = riosConFocoCritico(reports);

  function verDetalle(report) {
    setSeleccionado(report);
    setVolverA(PANTALLAS_CON_NAV.includes(pantalla) ? pantalla : "mapa");
    setPantalla("detalle");
  }

  // Abre la ficha de un río desde el directorio "Ríos": usa su reporte más
  // reciente, o una ficha sin reportes si todavía nadie lo ha reportado.
  function verRio(rio) {
    const masReciente = reports
      .filter((r) => r.rio === rio.rio)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
    verDetalle(
      masReciente || {
        sinReportes: true,
        rio: rio.rio,
        provincia: rio.provincia,
        corregimiento: rio.corregimiento,
        lat: rio.lat,
        lng: rio.lng,
      }
    );
  }

  function guardarReporte(datos) {
    // Se etiqueta con el autor real (el usuario que inició sesión), para
    // poder mostrar "Mis reportes" en el perfil con datos reales.
    const nuevo = addReport({ ...datos, autor: usuario ? usuario.nombre : null });
    if (nuevo.sinConexion) {
      setPantalla("mapa");
    } else {
      verDetalle(nuevo);
    }
  }

  function handleEscalar(id) {
    escalarReporte(id);
    setSeleccionado((prev) => (prev && prev.id === id ? { ...prev, estado: "enviado a autoridad" } : prev));
  }

  function handleConfirmar(id) {
    const cambio = alternarConfirmacion(id);
    setSeleccionado((prev) =>
      prev && prev.id === id ? { ...prev, confirmaciones: Math.max(0, prev.confirmaciones + cambio) } : prev
    );
  }

  function irLogin() {
    setMenuAbierto(false);
    setPantalla("login");
  }

  function irNuevoReporte() {
    if (!usuario) {
      setDestinoPendiente("nuevo");
      setPantalla("login");
      return;
    }
    setPantalla("nuevo");
  }

  // Navega a una de las pestañas del menú/barra inferior. "perfil" es una
  // pantalla propia; las otras tres viven dentro de MapaScreen y solo cambian
  // el scroll (vista).
  function irTab(tab) {
    setMenuAbierto(false);
    setAlertasAbiertas(false);
    if (tab === "rios") {
      setPantalla("rios");
      return;
    }
    if (tab === "perfil") {
      if (!usuario) {
        setDestinoPendiente("perfil");
        setPantalla("login");
        return;
      }
      setPantalla("perfil");
      return;
    }
    setVista(tab);
    setPantalla("mapa");
  }

  function handleLogin(datosUsuario) {
    setUsuario(datosUsuario);
    if (destinoPendiente) {
      setPantalla(destinoPendiente);
      setDestinoPendiente(null);
    } else {
      setPantalla("mapa");
    }
  }

  function handleLogout() {
    setUsuario(null);
    setMenuAbierto(false);
    setPantalla("mapa");
    setVista("inicio");
  }

  function agregarComentario(texto) {
    const iniciales = usuario.nombre.slice(0, 2).toUpperCase();
    setComentarios([{ iniciales, nombre: usuario.nombre, texto, tiempo: "ahora" }, ...comentarios]);
  }

  const titulos = {
    nuevo: "Nuevo reporte",
    detalle: seleccionado?.sinReportes ? "Ficha del río" : "Detalle del reporte",
    login: "Iniciar sesión",
  };
  const mostrarNav = PANTALLAS_CON_NAV.includes(pantalla);

  return (
    <div className="phone">
      {mostrarNav ? (
        <AppHeader
          usuario={usuario}
          riosCriticos={riosCriticos}
          menuAbierto={menuAbierto}
          alertasAbiertas={alertasAbiertas}
          onToggleMenu={() => {
            setMenuAbierto((v) => !v);
            setAlertasAbiertas(false);
          }}
          onToggleAlertas={() => {
            setAlertasAbiertas((v) => !v);
            setMenuAbierto(false);
          }}
          onIrTab={irTab}
          onIrLogin={irLogin}
          onLogout={handleLogout}
        />
      ) : (
        <div className="topbar">
          <button onClick={() => setPantalla(pantalla === "detalle" ? volverA : "mapa")}>←</button>
          <span>{titulos[pantalla]}</span>
        </div>
      )}

      {!online && (
        <div style={{ background: "var(--amber-bg)", color: "var(--amber)", fontSize: 12, textAlign: "center", padding: "6px 0" }}>
          Sin conexión{pendientes.length > 0 ? ` · ${pendientes.length} reporte(s) por sincronizar` : ""}
        </div>
      )}

      {pantalla === "mapa" && (
        <MapaScreen
          reports={reports}
          usuario={usuario}
          vista={vista}
          comentarios={comentarios}
          onSelect={verDetalle}
          onNuevoReporte={irNuevoReporte}
          onIrLogin={irLogin}
          onComentar={agregarComentario}
        />
      )}

      {pantalla === "rios" && <RiosScreen reports={reports} onVerRio={verRio} />}

      {pantalla === "perfil" && (
        <PerfilScreen
          usuario={usuario}
          reports={reports}
          onVerReporte={verDetalle}
          onLogout={handleLogout}
          onIrLogin={irLogin}
        />
      )}

      {pantalla === "login" && (
        <LoginScreen
          onBack={() => {
            setDestinoPendiente(null);
            setPantalla("mapa");
          }}
          onLogin={handleLogin}
        />
      )}

      {pantalla === "nuevo" && (
        <NuevoReporteScreen onBack={() => setPantalla("mapa")} onGuardar={guardarReporte} />
      )}

      {pantalla === "detalle" && seleccionado && (
        <DetalleScreen
          report={seleccionado}
          reports={reports}
          focoCritico={tieneFocoCritico(seleccionado.rio)}
          tendencia={tendenciaUltimos30Dias(seleccionado.rio)}
          onEscalar={handleEscalar}
          confirmado={confirmados.includes(seleccionado.id)}
          onConfirmar={handleConfirmar}
          onNuevoReporte={irNuevoReporte}
        />
      )}

      {mostrarNav && (
        <BottomNav activo={pantalla === "mapa" ? vista : pantalla} onSelect={irTab} />
      )}
    </div>
  );
}
