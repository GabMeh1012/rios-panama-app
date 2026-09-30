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
      <div style={{ textAlign: "center", padding: "24px 20px 8px" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--gray-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
            fontSize: 22,
          }}
        >
          💧
        </div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>Bienvenido a Ríos PTY</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
          Inicia sesión para reportar y comentar
        </div>
      </div>

      <div className="form-section" style={{ paddingTop: 8 }}>
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
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
          <span onClick={onBack} style={{ cursor: "pointer" }}>
            Explorar sin iniciar sesión
          </span>
        </div>
      </div>
    </div>
  );
}
