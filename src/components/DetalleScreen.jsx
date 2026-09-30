import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const labelSeveridad = { critico: "Crítico", moderado: "Moderado", leve: "Leve" };
const colorPorSeveridad = { critico: "#d64545", moderado: "#e0a52c", leve: "#2f9e63" };
const nombresMes = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

export default function DetalleScreen({ report, reports, focoCritico, tendencia, onEscalar }) {
  const maxTotal = Math.max(1, ...tendencia.map((t) => t.total));
  const yaEscalado = report.estado === "enviado a autoridad";

  // Todos los reportes de este mismo río (cada uno puede ser un tramo distinto).
  const delMismoRio = reports.filter((r) => r.rio === report.rio);
  const fechaMasReciente = delMismoRio.reduce((max, r) => (r.fecha > max ? r.fecha : max), delMismoRio[0].fecha);

  // Dirección de la tendencia, comparando los dos últimos meses con datos reales.
  let tendenciaTexto = "Sin datos suficientes";
  let tendenciaColor = "var(--text-secondary)";
  if (tendencia.length >= 2) {
    const diff = tendencia[tendencia.length - 1].total - tendencia[tendencia.length - 2].total;
    if (diff > 0) {
      tendenciaTexto = "↑ Empeorando";
      tendenciaColor = "var(--critico)";
    } else if (diff < 0) {
      tendenciaTexto = "↓ Mejorando";
      tendenciaColor = "var(--leve)";
    } else {
      tendenciaTexto = "→ Estable";
      tendenciaColor = "var(--moderado)";
    }
  }

  // Contaminantes más comunes reportados en este río, calculado a partir de
  // los datos reales de los reportes (no son cifras inventadas).
  const conteoTipos = {};
  delMismoRio.forEach((r) => {
    const lista = r.tipos && r.tipos.length ? r.tipos : [r.tipo];
    lista.forEach((t) => {
      conteoTipos[t] = (conteoTipos[t] || 0) + 1;
    });
  });
  const totalTipos = Object.values(conteoTipos).reduce((a, b) => a + b, 0) || 1;
  const tiposOrdenados = Object.entries(conteoTipos).sort(([, a], [, b]) => b - a);

  // Marcas observadas en todos los reportes de este río.
  const conteoMarcas = {};
  delMismoRio.forEach((r) => {
    (r.marcas || []).forEach((m) => {
      conteoMarcas[m] = (conteoMarcas[m] || 0) + 1;
    });
  });
  const marcasOrdenadas = Object.entries(conteoMarcas).sort(([, a], [, b]) => b - a);

  // Fotos reales subidas para este río (si nadie ha subido foto todavía, se
  // muestra un estado vacío en vez de inventar imágenes de relleno).
  const fotos = delMismoRio.filter((r) => r.foto).map((r) => ({ id: r.id, foto: r.foto }));

  return (
    <div className="screen">
      <div
        className="detail-photo"
        style={report.foto ? { backgroundImage: `url(${report.foto})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
      <div className="detail-body">
        <div className="detail-header">
          <span className="card-title" style={{ fontSize: 16 }}>
            {report.rio}
          </span>
          <span className={`badge ${report.severidad}`}>{labelSeveridad[report.severidad]}</span>
        </div>
        <p className="detail-meta">
          {report.provincia} · {report.fecha} · estado: {report.estado}
        </p>

        <div className="detail-desc">{report.descripcion}</div>

        <div className="detail-row">👥 {report.confirmaciones} vecinos confirmaron</div>
        <div className="detail-row">🧪 Tipo: {report.tipos ? report.tipos.join(", ") : report.tipo}</div>
        {report.marcas && report.marcas.length > 0 && (
          <div className="detail-row">🏷️ Marcas visibles: {report.marcas.join(", ")}</div>
        )}
        <div className="detail-row">
          📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
        </div>
      </div>

      {/* Resumen rápido en tarjetas, como en el wireframe. */}
      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-tile-label">Reportes totales</div>
          <div className="stat-tile-value">{delMismoRio.length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Reporte más reciente</div>
          <div className="stat-tile-value" style={{ fontSize: 15 }}>{fechaMasReciente}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Provincia</div>
          <div className="stat-tile-value" style={{ fontSize: 15 }}>{report.provincia}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Tendencia</div>
          <div className="stat-tile-value" style={{ fontSize: 15, color: tendenciaColor }}>{tendenciaTexto}</div>
        </div>
      </div>

      {tiposOrdenados.length > 0 && (
        <>
          <div className="section-title">Contaminantes más comunes</div>
          <div style={{ margin: "0 16px 6px" }}>
            {tiposOrdenados.map(([tipo, cant]) => {
              const pct = Math.round((cant / totalTipos) * 100);
              return (
                <div className="stat-bar-row" key={tipo}>
                  <div className="stat-bar-label">
                    <span>{tipo}</span>
                    <b>{pct}%</b>
                  </div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{ width: `${pct}%`, background: "var(--teal)" }} />
                  </div>
                </div>
              );
            })}
            {marcasOrdenadas.length > 0 && (
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "10px 0 16px" }}>
                Marcas más reportadas en este río: {marcasOrdenadas.map(([m]) => m).join(", ")}.
              </p>
            )}
          </div>
        </>
      )}

      <div className="section-title">Tendencia de reportes por mes</div>
      <div style={{ margin: "0 16px 18px" }}>
        {tendencia.length > 0 ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
            {tendencia.map((t) => (
              <div key={t.mes} style={{ textAlign: "center", flex: 1 }}>
                <div
                  style={{
                    height: `${(t.total / maxTotal) * 50 + 6}px`,
                    background: "linear-gradient(180deg, var(--teal), var(--navy))",
                    borderRadius: 4,
                    marginBottom: 4,
                  }}
                  title={`${t.total} reportes`}
                />
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  {nombresMes[t.mes.slice(5, 7)]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Aún no hay suficiente historial para graficar una tendencia.</p>
        )}
      </div>

      <div className="section-title">Fotos de la comunidad</div>
      {fotos.length > 0 ? (
        <div className="gallery-grid">
          {fotos.map((f) => (
            <div key={f.id} className="gallery-tile" style={{ backgroundImage: `url(${f.foto})` }} />
          ))}
        </div>
      ) : (
        <p style={{ margin: "0 16px 18px", fontSize: 12, color: "var(--text-secondary)" }}>
          Aún no hay fotos para este río — sé el primero en reportar con una foto.
        </p>
      )}

      <div className="section-title">Información adicional</div>
      <dl className="info-card">
        <dt>Reportes registrados en este río</dt>
        <dd>{delMismoRio.length}</dd>
        <dt>Provincia</dt>
        <dd>{report.provincia}</dd>
        <dt>Reporte más reciente</dt>
        <dd>{fechaMasReciente}</dd>
      </dl>

      <div className="section-title">Reportes a lo largo del río</div>
      <div style={{ margin: "0 16px 18px", borderRadius: 12, overflow: "hidden", height: 150 }}>
        <MapContainer
          center={[report.lat, report.lng]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {delMismoRio.map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.lat, r.lng]}
              radius={7}
              pathOptions={{ color: colorPorSeveridad[r.severidad], fillOpacity: 0.85, weight: 2 }}
            >
              <Tooltip>{labelSeveridad[r.severidad]} · {r.tipo}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      {delMismoRio.length === 1 && (
        <p style={{ margin: "-10px 16px 18px", fontSize: 11, color: "var(--text-secondary)" }}>
          Este río solo tiene un tramo reportado hasta ahora.
        </p>
      )}

      <div className="detail-body" style={{ paddingTop: 0 }}>
        {focoCritico && (
          <div className="alert-box">⚠️ Alerta de foco crítico: múltiples reportes en este río</div>
        )}

        <button
          className="submit-btn"
          style={{ marginTop: 14, opacity: yaEscalado ? 0.6 : 1 }}
          disabled={yaEscalado}
          onClick={() => onEscalar(report.id)}
        >
          {yaEscalado ? "Ya enviado a Miambiente / ANAM" : "Escalar a autoridad (Miambiente / ANAM)"}
        </button>
      </div>
    </div>
  );
}
