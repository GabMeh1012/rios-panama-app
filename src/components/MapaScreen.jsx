import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { noticias, tiposContaminacion } from "../data/seedReports";
import { zonas, zonasMapa } from "../data/panamaZonas";
import TipoIcon from "./TipoIcon";
import { formatearFechaRelativa } from "../utils/fecha";

const colorPorSeveridad = {
  critico: "#d64545",
  moderado: "#e0a52c",
  leve: "#2f9e63",
};

const labelSeveridad = { critico: "Crítico", moderado: "Moderado", leve: "Leve" };

// Colores para los avatares apilados de la tarjeta de Comunidad (solo
// estilo, se repiten en orden fijo, no representan nada de cada persona).
const coloresAvatar = ["var(--sky)", "var(--teal)", "var(--critico)"];

// Para dibujar el ícono correcto en cada tarjeta de "Reportes recientes" a
// partir del nombre del tipo de contaminación guardado en el reporte.
const idPorTipo = Object.fromEntries(tiposContaminacion.map((t) => [t.label, t.id]));

// Distancia aproximada en grados, igual que en seedReports.js (suficiente
// para ordenar "cerca de mí" en un prototipo).
function distancia(lat1, lng1, lat2, lng2) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

const problemas = [
  { id: "todos", label: "Todos" },
  { id: "criticos", label: "Más contaminados" },
  ...tiposContaminacion.map((t) => ({ id: t.label, label: t.label, icon: t.id })),
];

// Ajusta la vista del mapa a la zona seleccionada (o vuelve al centro del país).
function VistaZona({ zona }) {
  const map = useMap();
  useEffect(() => {
    const z = zonasMapa[zona];
    if (z) {
      map.flyToBounds(z.bounds, { padding: [20, 20], duration: 0.6 });
    } else {
      map.flyTo([8.6, -80.2], 7, { duration: 0.6 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zona]);
  return null;
}

export default function MapaScreen({ reports, usuario, vista, comentarios, onSelect, onNuevoReporte, onIrLogin, onComentar }) {
  const centro = [8.6, -80.2]; // vista general de Panamá
  const [zona, setZona] = useState("Todas");
  const [problema, setProblema] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [comentario, setComentario] = useState("");
  const [orden, setOrden] = useState("recientes"); // "recientes" | "cerca" | "confirmados"
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);

  // Refs para el scroll suave hacia cada sección cuando se toca una pestaña
  // del menú o de la barra inferior (Inicio / Mapa / Comunidad).
  const inicioRef = useRef(null);
  const mapaRef = useRef(null);
  const comunidadRef = useRef(null);

  useEffect(() => {
    const refs = { inicio: inicioRef, mapa: mapaRef, comunidad: comunidadRef };
    refs[vista]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [vista]);

  const filtrados = reports.filter((r) => {
    const pasaZona = zona === "Todas" || r.provincia.includes(zona);
    const pasaProblema =
      problema === "todos" ||
      (problema === "criticos" ? r.severidad === "critico" : r.tipo === problema);
    const pasaBusqueda =
      !busqueda.trim() || r.rio.toLowerCase().includes(busqueda.trim().toLowerCase());
    return pasaZona && pasaProblema && pasaBusqueda;
  });

  // Orden real de "Reportes recientes" según la pestaña elegida: por fecha,
  // por cercanía real al GPS del usuario, o por confirmaciones.
  const reportesOrdenados = [...filtrados].sort((a, b) => {
    if (orden === "confirmados") return b.confirmaciones - a.confirmaciones;
    if (orden === "cerca" && miUbicacion) {
      return (
        distancia(miUbicacion.lat, miUbicacion.lng, a.lat, a.lng) -
        distancia(miUbicacion.lat, miUbicacion.lng, b.lat, b.lng)
      );
    }
    return b.fecha.localeCompare(a.fecha);
  });

  function elegirOrden(o) {
    setOrden(o);
    if (o === "cerca" && !miUbicacion && navigator.geolocation) {
      setBuscandoUbicacion(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMiUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setBuscandoUbicacion(false);
        },
        () => setBuscandoUbicacion(false)
      );
    }
  }

  function enviarComentario() {
    if (!usuario) {
      onIrLogin();
      return;
    }
    if (!comentario.trim()) return;
    onComentar(comentario.trim());
    setComentario("");
  }

  return (
    <div className="screen">
      <div ref={inicioRef} />
      {usuario && (
        <p style={{ margin: "10px 14px 0", fontSize: 12, color: "var(--text-secondary)" }}>Hola, {usuario.nombre} 👋</p>
      )}

      <div className="search-box">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Buscar río o quebrada..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="section-title" style={{ paddingTop: 4 }}>Zona</div>
      <div className="chip-row">
        {zonas.map((z) => (
          <span
            key={z}
            onClick={() => setZona(z)}
            className={`chip ${zona === z ? "active" : ""}`}
          >
            {z}
          </span>
        ))}
      </div>

      <div className="section-title" style={{ paddingTop: 0 }}>Tipo de contaminación</div>
      <div className="chip-row" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
        {problemas.map((p) => (
          <span
            key={p.id}
            onClick={() => setProblema(p.id)}
            className={`chip ${problema === p.id ? "active" : ""}`}
          >
            {p.icon && <TipoIcon id={p.icon} size={13} />}
            {p.id === "criticos" && <TipoIcon id="critico" size={13} />}
            {p.label}
          </span>
        ))}
      </div>

      <div ref={mapaRef} className="map-wrap" style={{ height: 236, margin: "10px 14px", borderRadius: 14, overflow: "hidden", width: "auto" }}>
        <MapContainer center={centro} zoom={7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <VistaZona zona={zona} />
          {zona !== "Todas" && zonasMapa[zona] && (
            <Rectangle
              bounds={zonasMapa[zona].bounds}
              pathOptions={{ color: zonasMapa[zona].color, weight: 2, fillOpacity: 0.12 }}
            />
          )}
          {filtrados.map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.lat, r.lng]}
              radius={8}
              pathOptions={{ color: colorPorSeveridad[r.severidad], fillOpacity: 0.85, weight: 2 }}
              eventHandlers={{ click: () => onSelect(r) }}
            >
              <Popup>
                <b>{r.rio}</b>
                <br />
                {r.severidad === "critico" ? "Crítico" : r.severidad === "moderado" ? "Moderado" : "Leve"} · {r.tipo}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <p style={{ margin: "0 14px 4px", fontSize: 11, color: "var(--text-secondary)" }}>
        Toca "{zona}" arriba para resaltar esa zona en el mapa. Cada punto es un tramo o río reportado por la comunidad.
      </p>

      <div className="section-title">Reportes recientes {filtrados.length !== reports.length ? `(${filtrados.length})` : ""}</div>

      <div className="orden-tabs">
        <button className={`orden-tab ${orden === "recientes" ? "active" : ""}`} onClick={() => elegirOrden("recientes")}>
          Recientes
        </button>
        <button className={`orden-tab ${orden === "cerca" ? "active" : ""}`} onClick={() => elegirOrden("cerca")}>
          Cerca de mí
        </button>
        <button className={`orden-tab ${orden === "confirmados" ? "active" : ""}`} onClick={() => elegirOrden("confirmados")}>
          Más confirmados
        </button>
      </div>
      {orden === "cerca" && buscandoUbicacion && (
        <p style={{ margin: "0 14px 10px", fontSize: 11, color: "var(--text-secondary)" }}>Buscando tu ubicación...</p>
      )}
      {orden === "cerca" && !buscandoUbicacion && !miUbicacion && (
        <p style={{ margin: "0 14px 10px", fontSize: 11, color: "var(--text-secondary)" }}>
          No pudimos usar tu ubicación — mostrando el orden habitual.
        </p>
      )}

      <div>
        {reportesOrdenados.length === 0 && (
          <p style={{ padding: "0 14px", fontSize: 12, color: "var(--text-secondary)" }}>
            No hay reportes con estos filtros.
          </p>
        )}
        {reportesOrdenados.map((r) => (
          <div
            key={r.id}
            className={`report-card ${r.severidad} ${r.severidad === "critico" ? "urgente" : ""} ${r.autor ? "ciudadano" : ""}`}
            onClick={() => onSelect(r)}
          >
            <span className={`report-card-icon ${r.severidad}`}>
              <TipoIcon id={idPorTipo[r.tipo] || "otr"} size={19} />
            </span>
            <div className="report-card-body">
              <div className="report-card-top">
                <span className="card-title">{r.rio}</span>
                <span className={`badge ${r.severidad}`}>{labelSeveridad[r.severidad]}</span>
              </div>
              <p className="card-sub" style={{ margin: "2px 0 0" }}>
                {r.tipos ? r.tipos.join(", ") : r.tipo}
                {r.autor ? ` · Reportado por ${r.autor}` : ""}
              </p>
              <div className="report-card-meta">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="8" r="3"></circle>
                  <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"></path>
                </svg>
                {r.confirmaciones} confirmaron <span style={{ opacity: 0.6 }}>· {formatearFechaRelativa(r.fecha)}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-secondary)", flexShrink: 0 }}>
              <path d="M9 6l6 6-6 6"></path>
            </svg>
          </div>
        ))}
      </div>

      <div className="section-title">Noticias</div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 14px 12px" }}>
        {noticias.map((n) => (
          <div key={n.titulo} style={{ flexShrink: 0, width: 150, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 50, background: n.color }} />
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.4 }}>{n.titulo}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>{n.fuente}</div>
            </div>
          </div>
        ))}
      </div>

      <div ref={comunidadRef} className="section-title">Comunidad</div>

      <div className="community-card">
        <div className="community-avatars">
          {comentarios.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="community-avatar"
              style={{ background: coloresAvatar[i % coloresAvatar.length], zIndex: 3 - i }}
            >
              {c.iniciales}
            </span>
          ))}
        </div>
        <span className="community-stat">
          <b>{comentarios.length}</b> {comentarios.length === 1 ? "comentario" : "comentarios"} de la comunidad
        </span>
        <p className="community-desc">
          Comparte lo que ves en tu río y entérate de lo que reportan tus vecinos.
        </p>
      </div>

      <div style={{ padding: "0 14px 8px" }}>
        {comentarios.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--gray-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, color: "var(--teal)" }}>
              {c.iniciales}
            </div>
            <div>
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{c.nombre}</span>{" "}
                <span style={{ color: "var(--text-secondary)" }}>· {c.tiempo}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.texto}</div>
            </div>
          </div>
        ))}
      </div>

      {usuario ? (
        <div style={{ margin: "0 14px 12px", display: "flex", gap: 8 }}>
          <input
            className="field"
            style={{ marginBottom: 0, flex: 1 }}
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <button className="submit-btn" style={{ width: "auto", padding: "0 16px" }} onClick={enviarComentario}>
            Enviar
          </button>
        </div>
      ) : (
        <div
          onClick={onIrLogin}
          style={{
            margin: "0 14px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--gray-bg)",
            borderRadius: 20,
            padding: "9px 13px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>Inicia sesión para comentar</span>
        </div>
      )}

      <button className="fab" onClick={onNuevoReporte}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Reportar río
      </button>
    </div>
  );
}
