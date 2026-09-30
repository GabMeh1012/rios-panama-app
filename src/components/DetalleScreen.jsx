const labelSeveridad = { critico: "Crítico", moderado: "Moderado", leve: "Leve" };
const nombresMes = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

export default function DetalleScreen({ report, focoCritico, tendencia, onEscalar }) {
  const maxTotal = Math.max(1, ...tendencia.map((t) => t.total));
  const yaEscalado = report.estado === "enviado a autoridad";

  return (
    <div className="screen">
      <div className="detail-photo" />
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
        {report.marca && <div className="detail-row">🏷️ Marca visible: {report.marca}</div>}
        <div className="detail-row">
          📍 {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
        </div>

        {tendencia.length > 1 && (
          <div style={{ margin: "14px 0" }}>
            <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 8px" }}>
              Tendencia de reportes por mes
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
              {tendencia.map((t) => (
                <div key={t.mes} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      height: `${(t.total / maxTotal) * 50 + 6}px`,
                      background: "var(--navy)",
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
          </div>
        )}

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
