export default function PerfilScreen({ usuario, onLogout, onIrLogin }) {
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
