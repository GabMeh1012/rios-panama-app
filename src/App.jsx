import { useState } from "react";
import { useReports } from "./data/useReports";
import { comentariosSemilla } from "./data/seedReports";
import MapaScreen from "./components/MapaScreen";
import NuevoReporteScreen from "./components/NuevoReporteScreen";
import DetalleScreen from "./components/DetalleScreen";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const { reports, pendientes, online, addReport, tieneFocoCritico, escalarReporte, tendenciaPorMes } =
    useReports();
  const [pantalla, setPantalla] = useState("mapa"); // "mapa" | "nuevo" | "detalle" | "login"
  const [seleccionado, setSeleccionado] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [comentarios, setComentarios] = useState(comentariosSemilla);
  const [pendienteReporte, setPendienteReporte] = useState(false);

  function irNuevoReporte() {
    if (!usuario) {
      setPendienteReporte(true);
      setPantalla("login");
      return;
    }
    setPantalla("nuevo");
  }

  function verDetalle(report) {
    setSeleccionado(report);
    setPantalla("detalle");
  }

  function guardarReporte(datos) {
    const nuevo = addReport(datos);
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

  function handleLogin(datosUsuario) {
    setUsuario(datosUsuario);
    if (pendienteReporte) {
      setPendienteReporte(false);
      setPantalla("nuevo");
    } else {
      setPantalla("mapa");
    }
  }

  function agregarComentario(texto) {
    const iniciales = usuario.nombre.slice(0, 2).toUpperCase();
    setComentarios([{ iniciales, nombre: usuario.nombre, texto, tiempo: "ahora" }, ...comentarios]);
  }

  const titulos = { mapa: "Ríos PTY", nuevo: "Nuevo reporte", detalle: "Detalle del reporte", login: "Iniciar sesión" };

  return (
    <div className="phone">
      <div className="topbar">
        {pantalla !== "mapa" && <button onClick={() => setPantalla("mapa")}>←</button>}
        {pantalla === "mapa" ? (
          <span className="logo-type">{titulos[pantalla]}</span>
        ) : (
          <span>{titulos[pantalla]}</span>
        )}
      </div>

      {!online && (
        <div style={{ background: "var(--amber-bg)", color: "var(--amber)", fontSize: 12, textAlign: "center", padding: "6px 0" }}>
          Sin conexión{pendientes.length > 0 ? ` · ${pendientes.length} reporte(s) por sincronizar` : ""}
        </div>
      )}

      {pantalla === "mapa" && (
        <MapaScreen
          reports={reports}
          usuario={usuario}
          onSelect={verDetalle}
          onNuevoReporte={irNuevoReporte}
          onIrLogin={() => {
            setPendienteReporte(false);
            setPantalla("login");
          }}
          onComentar={agregarComentario}
        />
      )}

      {pantalla === "login" && (
        <LoginScreen
          onBack={() => {
            setPendienteReporte(false);
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
          tendencia={tendenciaPorMes(seleccionado.rio)}
          onEscalar={handleEscalar}
        />
      )}
    </div>
  );
}
