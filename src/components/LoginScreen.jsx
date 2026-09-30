import { useState } from "react";
import rioHero from "../assets/rio-hero-login.jpg";

export default function LoginScreen({ onBack, onLogin }) {
  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (modo === "registro" && !nombre.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }
    if (!correo.trim() || !clave.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setError("");
    onLogin({ nombre: modo === "registro" ? nombre.trim() : correo.split("@")[0], correo: correo.trim() });
  }

  return (
    <div className="screen">
      {/* Foto real de un río, con el mismo degradado de antes para que el
          texto "Ríos PTY" siga siendo legible encima. */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={rioHero}
          alt="Río panameño rodeado de vegetación"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, #fff 2%, rgba(10,40,45,.15) 40%, rgba(6,25,28,.55) 100%)" }} />
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
        <div className="brand-tabs" style={{ margin: "0 0 16px" }}>
          <button
            type="button"
            className={`brand-tab ${modo === "login" ? "active" : ""}`}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => {
              setModo("login");
              setError("");
            }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`brand-tab ${modo === "registro" ? "active" : ""}`}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => {
              setModo("registro");
              setError("");
            }}
          >
            Crear cuenta
          </button>
        </div>

        {modo === "registro" && (
          <>
            <label className="field-label">Nombre completo</label>
            <input
              className="field"
              placeholder="Tu nombre y apellido"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </>
        )}

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
          {modo === "registro" ? "Crear cuenta" : "Iniciar sesión"}
        </button>
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-secondary)", margin: "14px 0" }}>
          Este {modo === "registro" ? "registro" : "login"} es una simulación para el prototipo — cualquier correo y contraseña funcionan.
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
