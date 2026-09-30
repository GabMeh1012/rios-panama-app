const labelSeveridad = { critico: "Crítico", moderado: "Moderado", leve: "Leve" };

export default function PerfilScreen({ usuario, reports, onVerReporte, onLogout, onIrLogin }) {
  if (!usuario) {
    return (
      <div className="screen">
        <div className="detail-body" style={{ textAlign: "center", paddingTop: 30 }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
            Inicia sesión o crea una cuenta para ver tu perfil.
          </p>
          <button className="submit-btn" style={{ marginTop: 10 }} onClick={onIrLogin}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const iniciales = usuario.nombre.slice(0, 2).toUpperCase();
  // Reportes creados de verdad por este usuario (se etiquetan al guardarse
  // en App.jsx). Si aún no ha creado ninguno, se dice honestamente.
  const misReportes = reports.filter((r) => r.autor === usuario.nombre);

  return (
    <div className="screen">
      <div className="detail-body" style={{ textAlign: "center", paddingTop: 28 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--teal-bg)",
            color: "var(--teal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
            margin: "0 auto 12px",
          }}
        >
          {iniciales}
        </div>
        <div className="card-title" style={{ fontSize: 17 }}>{usuario.nombre}</div>
        {usuario.correo && <p className="card-sub" style={{ marginTop: 2 }}>{usuario.correo}</p>}
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="stat-tile">
          <div className="stat-tile-label">Reportes que has creado</div>
          <div className="stat-tile-value">{misReportes.length}</div>
        </div>
      </div>

      <div className="section-title">Mis reportes</div>
      {misReportes.length === 0 ? (
        <p style={{ margin: "0 16px 18px", fontSize: 12, color: "var(--text-secondary)" }}>
          Aún no has creado ningún reporte. Cuando reportes un río o tramo, aparecerá aquí.
        </p>
      ) : (
        <div className="list">
          {misReportes.map((r) => (
            <div className="card" key={r.id} onClick={() => onVerReporte(r)}>
              <span className={`dot ${r.severidad}`}></span>
              <div>
                <p className="card-title">{r.rio}</p>
                <p className="card-sub">
                  {labelSeveridad[r.severidad]} · {r.tipos ? r.tipos.join(", ") : r.tipo} · {r.fecha}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <dl className="info-card">
        <dt>Cuenta</dt>
        <dd>Simulada para este prototipo de clase — no hay backend real todavía.</dd>
      </dl>

      <div className="detail-body" style={{ paddingTop: 0 }}>
        <button
          className="submit-btn"
          style={{ background: "var(--gray-bg)", color: "var(--navy)", boxShadow: "none" }}
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
