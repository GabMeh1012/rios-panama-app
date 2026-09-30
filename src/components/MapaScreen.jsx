import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { noticias, comentariosSemilla, tiposContaminacion } from "../data/seedReports";
import { zonas, zonasMapa } from "../data/panamaZonas";
import TipoIcon from "./TipoIcon";

const colorPorSeveridad = {
  critico: "#d64545",
  moderado: "#e0a52c",
  leve: "#2f9e63",
};

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

export default function MapaScreen({ reports, usuario, onSelect, onNuevoReporte, onIrLogin, onComentar }) {
  const centro = [8.6, -80.2]; // vista general de Panamá
  const [zona, setZona] = useState("Todas");
  const [problema, setProblema] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [comentario, setComentario] = useState("");

  const filtrados = reports.filter((r) => {
    const pasaZona = zona === "Todas" || r.provincia.includes(zona);
    const pasaProblema =
      problema === "todos" ||
      (problema === "criticos" ? r.severidad === "critico" : r.tipo === problema);
    const pasaBusqueda =
      !busqueda.trim() || r.rio.toLowerCase().includes(busqueda.trim().toLowerCase());
    return pasaZona && pasaProblema && pasaBusqueda;
  });

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "10px 14px 0" }}>
        {usuario ? (
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Hola, {usuario.nombre}</span>
        ) : (
          <button
            onClick={onIrLogin}
            style={{
              background: "transparent",
              border: "1.5px solid var(--border-strong)",
              color: "var(--navy)",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 13px",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </button>
        )}
      </div>

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

      <div className="map-wrap" style={{ height: 236, margin: "10px 14px", borderRadius: 14, overflow: "hidden", width: "auto" }}>
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
      <div className="list">
        {filtrados.length === 0 && (
          <p style={{ padding: "0 14px", fontSize: 12, color: "var(--text-secondary)" }}>
            No hay reportes con estos filtros.
          </p>
        )}
        {filtrados.map((r) => (
          <div className="card" key={r.id} onClick={() => onSelect(r)}>
            <span className={`dot ${r.severidad}`}></span>
            <div>
              <p className="card-title">{r.rio}</p>
              <p className="card-sub">
                {r.severidad === "critico" ? "Crítico" : r.severidad === "moderado" ? "Moderado" : "Leve"} ·{" "}
                {r.tipos ? r.tipos.join(", ") : r.tipo}
              </p>
            </div>
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

      <div className="section-title">Comunidad</div>
      <div style={{ padding: "0 14px 8px" }}>
        {comentariosSemilla.map((c, i) => (
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
