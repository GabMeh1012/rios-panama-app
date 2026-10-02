// Encabezado moderno para las pantallas principales (Inicio/Mapa/Comunidad y
// Perfil), inspirado en el wireframe: menú hamburguesa, logo + descripción,
// campanita de alertas (con las mismas reglas reales de "foco crítico" que ya
// usa el resto de la app) y acceso al perfil.
export default function AppHeader({
  usuario,
  riosCriticos,
  menuAbierto,
  alertasAbiertas,
  onToggleMenu,
  onToggleAlertas,
  onIrTab,
  onIrLogin,
  onLogout,
}) {
  return (
    <div className="app-header">
      <div className="app-header-row">
        <button className="header-btn" onClick={onToggleMenu} aria-label="Abrir menú">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <div className="app-header-title">
          <div className="logo-type" style={{ fontSize: 19 }}>Ríos PTY</div>
          <div className="app-header-sub">Monitoreo ciudadano de ríos</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="header-btn" onClick={onToggleAlertas} aria-label="Ver alertas">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {riosCriticos.length > 0 && <span className="badge-dot" />}
          </button>
          <button className="header-btn" onClick={() => onIrTab("perfil")} aria-label="Ir a mi perfil">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
        </div>
      </div>

      {menuAbierto && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => onIrTab("inicio")}>Inicio</div>
          <div className="dropdown-item" onClick={() => onIrTab("mapa")}>Mapa</div>
          <div className="dropdown-item" onClick={() => onIrTab("rios")}>Ríos</div>
          <div className="dropdown-item" onClick={() => onIrTab("comunidad")}>Comunidad</div>
          <div className="dropdown-item" onClick={() => onIrTab("perfil")}>Perfil</div>
          <div className="dropdown-item" onClick={usuario ? onLogout : onIrLogin}>
            {usuario ? "Cerrar sesión" : "Iniciar sesión"}
          </div>
        </div>
      )}

      {alertasAbiertas && (
        <div className="dropdown-menu">
          {riosCriticos.length === 0 ? (
            <div className="dropdown-item" style={{ color: "var(--text-secondary)", cursor: "default" }}>
              Sin alertas de foco crítico por ahora.
            </div>
          ) : (
            riosCriticos.map(({ rio, total }) => (
              <div key={rio} className="dropdown-item" style={{ color: "var(--critico)" }}>
                ⚠️ {rio}: {total} reportes activos
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
