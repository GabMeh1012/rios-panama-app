import { useState } from "react";

export default function LoginScreen({ onBack, onLogin }) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!correo.trim() || !clave.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setError("");
    onLogin({ nombre: correo.split("@")[0] });
  }

  return (
    <div className="screen">
      {/* Hero ilustrado (colinas + río) en lugar de una foto de stock, ya que
          este prototipo no tiene forma de descargar imágenes con licencia. */}
      <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
        <svg viewBox="0 0 390 190" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
          <defs>
            <linearGradient id="loginSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfe0e6" />
              <stop offset="55%" stopColor="#8fc2c4" />
              <stop offset="100%" stopColor="#4f8e86" />
            </linearGradient>
          </defs>
          <rect width="390" height="190" fill="url(#loginSky)" />
          <circle cx="300" cy="45" r="22" fill="#fdf1c7" opacity="0.9" />
          <path d="M0 90Q90 60 160 82T390 68V190H0Z" fill="#2f6b62" opacity="0.55" />
          <path d="M0 115Q70 88 150 106T390 92V190H0Z" fill="#1f5148" opacity="0.7" />
          <path d="M0 150Q60 120 130 140T260 148T390 128V190H0Z" fill="#123f3a" opacity="0.9" />
          <path d="M0 190C40 150 70 132 120 132C170 132 190 160 235 160C285 160 300 132 345 132C365 132 380 150 390 165V190Z" fill="#eaf7ee" opacity="0.55" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, #fff 2%, rgba(10,40,45,.05) 45%, rgba(10,40,45,.15) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center" }}>
          <div className="logo-type" style={{ fontSize: 30, color: "#fff", textShadow: "0 2px 14px rgba(6,30,34,.45)" }}>
            Ríos PTY
          </div>
          <div style={{ color: "#f1fbf8", fontSize: 12, marginTop: 3, textShadow: "0 1px 6px rgba(6,30,34,.4)" }}>
            Cuida los ríos de Panamá, repórtalos
          </div>
        </div>
      </div>

      <div className="form-section" style={{ paddingTop: 10 }}>
        <label className="field-label">Correo electrónico</label>
        <input
          className="field"
          placeholder="nombre@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <label className="field-label">Contraseña</label>
        <input
          className="field"
          type="password"
          placeholder="••••••••"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="submit-btn" onClick={handleSubmit}>
          Iniciar sesión
        </button>
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-secondary)", margin: "14px 0" }}>
          Este login es una simulación para el prototipo — cualquier correo y contraseña funcionan.
        </div>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--teal)", fontWeight: 600, marginTop: 4 }}>
          <span onClick={onBack} style={{ cursor: "pointer" }}>
            Explorar sin iniciar sesión
          </span>
        </div>
      </div>
    </div>
  );
}
