import { useState } from "react";
import { riosConocidos } from "../data/seedReports";
import { infoGeneralRios } from "../data/riosInfo";
import { esReporteActivo, riosConFocoCritico } from "../data/useReports";
import { formatearFechaRelativa } from "../utils/fecha";

const ordenes = [
  { id: "reportados", label: "Más reportados" },
  { id: "menos", label: "Menos reportados" },
  { id: "az", label: "A–Z" },
];

// Directorio de ríos: todos los ríos cargados en el sistema en un solo lugar,
// tengan o no reportes. Al tocar uno se abre su ficha (la misma pantalla de
// detalle que se abre desde un reporte).
export default function RiosScreen({ reports, onVerRio }) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("reportados");

  const criticos = new Set(riosConFocoCritico(reports).map((c) => c.rio));

  // Ríos conocidos, más cualquier otro nombre que aparezca en los reportes
  // (por ejemplo, un punto que todavía no se pudo identificar).
  const conocidos = new Set(riosConocidos.map((r) => r.rio));
  const extras = [];
  reports.forEach((r) => {
    if (!conocidos.has(r.rio) && !extras.some((e) => e.rio === r.rio)) {
      extras.push({ rio: r.rio, provincia: r.provincia, corregimiento: r.corregimiento, lat: r.lat, lng: r.lng });
    }
  });

  const rios = [...riosConocidos, ...extras].map((rio) => {
    const suyos = reports.filter((r) => r.rio === rio.rio);
    const ultimaFecha = suyos.reduce((max, r) => (r.fecha > max ? r.fecha : max), "");
    return {
      ...rio,
      total: suyos.length,
      activos: suyos.filter(esReporteActivo).length,
      ultimaFecha,
      critico: criticos.has(rio.rio),
      info: infoGeneralRios[rio.rio],
    };
  });

  const texto = busqueda.trim().toLowerCase();
  const visibles = rios
    .filter((r) => !texto || r.rio.toLowerCase().includes(texto) || r.provincia.toLowerCase().includes(texto))
    .sort((a, b) => {
      if (orden === "az") return a.rio.localeCompare(b.rio, "es");
      if (orden === "menos") return a.total - b.total || a.rio.localeCompare(b.rio, "es");
      return b.total - a.total || a.rio.localeCompare(b.rio, "es");
    });

  return (
    <div className="screen">
      <div className="section-title" style={{ paddingBottom: 0 }}>Ríos</div>
      <p style={{ margin: "2px 14px 0", fontSize: 12, color: "var(--text-secondary)" }}>
        {rios.length} ríos en el sistema · {criticos.size} con foco crítico
      </p>

      <div className="search-box">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Buscar río o provincia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="orden-tabs">
        {ordenes.map((o) => (
          <button key={o.id} className={`orden-tab ${orden === o.id ? "active" : ""}`} onClick={() => setOrden(o.id)}>
            {o.label}
          </button>
        ))}
      </div>

      {visibles.length === 0 && (
        <p style={{ padding: "0 14px", fontSize: 12, color: "var(--text-secondary)" }}>
          No hay ríos que coincidan con la búsqueda.
        </p>
      )}

      {visibles.map((r) => {
        let estado = { clase: "sin", label: "Sin reportes" };
        if (r.critico) estado = { clase: "critico", label: "Foco crítico" };
        else if (r.total > 0) estado = { clase: "con", label: "Con reportes" };
        return (
          <button key={r.rio} className={`rio-card ${estado.clase}`} onClick={() => onVerRio(r)}>
            <div className="rio-card-top">
              <span className="card-title">{r.rio}</span>
              <span className={`rio-estado ${estado.clase}`}>{estado.label}</span>
            </div>
            <p className="card-sub">
              {r.provincia}
              {r.info ? ` · ${r.info.longitud}` : ""}
            </p>
            <div className="rio-card-stats">
              <span>
                <b>{r.total}</b> {r.total === 1 ? "reporte" : "reportes"}
              </span>
              <span>
                <b>{r.activos}</b> {r.activos === 1 ? "activo" : "activos"}
              </span>
              <span>{r.ultimaFecha ? `Último: ${formatearFechaRelativa(r.ultimaFecha)}` : "Sin actividad"}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
