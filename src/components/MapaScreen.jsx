import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { noticias, comentariosSemilla } from "../data/seedReports";

const colorPorSeveridad = {
  critico: "#e24b4a",
  moderado: "#ef9f27",
  leve: "#5dcaa5",
};

const zonas = ["Todas", "Panamá Este", "Azuero", "Chiriquí", "Ciudad de Panamá"];
const problemas = [
  { id: "todos", label: "Todas" },
  { id: "criticos", label: "Más contaminados" },
  { id: "Basura / plásticos", label: "Basura" },
  { id: "Aguas negras", label: "Aguas negras" },
  { id: "Contaminación industrial", label: "Industrial" },
];

export default function MapaScreen({ reports, usuario, onSelect, onNuevoReporte, onIrLogin, onComentar }) {
  const centro = [8.98, -79.6]; // Ciudad de Panamá
  const [zona, setZona] = useState("Todas");
  const [problema, setProblema] = useState("todos");
  const [comentario, setComentario] = useState("");

  const filtrados = reports.filter((r) => {
    const pasaZona = zona === "Todas" || r.provincia.includes(zona);
    const pasaProblema =
      problema === "todos" ||
      (problema === "criticos" ? r.severidad === "critico" : r.tipo === problema);
    return pasaZona && pasaProblema;
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
              border: "0.5px solid var(--border-strong)",
              color: "var(--navy)",
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </button>
        )}
      </div>

      <div className="section-title" style={{ paddingTop: 6 }}>Zona</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 14px 8px" }}>
        {zonas.map((z) => (
          <span
            key={z}
            onClick={() => setZona(z)}
            style={{
              flexShrink: 0,
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 20,
              cursor: "pointer",
              background: zona === z ? "var(--navy)" : "transparent",
              color: zona === z ? "#fff" : "var(--text-secondary)",
              border: zona === z ? "none" : "0.5px solid var(--border-strong)",
            }}
          >
            {z}
          </span>
        ))}
      </div>

      <div className="section-title" style={{ paddingTop: 0 }}>Tipo de problema</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 14px 10px", borderBottom: "0.5px solid var(--border)" }}>
        {problemas.map((p) => (
          <span
            key={p.id}
            onClick={() => setProblema(p.id)}
            style={{
              flexShrink: 0,
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: 20,
              cursor: "pointer",
              background: problema === p.id ? "#FCEBEB" : "transparent",
              color: problema === p.id ? "#A32D2D" : "var(--text-secondary)",
              border: problema === p.id ? "none" : "0.5px solid var(--border-strong)",
            }}
          >
            {p.label}
          </span>
        ))}
      </div>

      <div className="map-wrap" style={{ height: 180, margin: "10px 14px", borderRadius: 10, overflow: "hidden", width: "auto" }}>
        <MapContainer center={centro} zoom={9} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtrados.map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.lat, r.lng]}
              radius={8}
              pathOptions={{ color: colorPorSeveridad[r.severidad], fillOpacity: 0.8 }}
              eventHandlers={{ click: () => onSelect(r) }}
            >
              <Popup>{r.rio}</Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

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
          <div key={n.titulo} style={{ flexShrink: 0, width: 150, border: "0.5px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: 50, background: n.color }} />
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, lineHeight: 1.4 }}>{n.titulo}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>{n.fuente}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Comunidad</div>
      <div style={{ padding: "0 14px 8px" }}>
        {comentariosSemilla.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--gray-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
              {c.iniciales}
            </div>
            <div>
              <div style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 500 }}>{c.nombre}</span>{" "}
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
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>Inicia sesión para comentar</span>
        </div>
      )}

      <button className="fab" onClick={onNuevoReporte}>
        + Reportar río
      </button>
    </div>
  );
}
