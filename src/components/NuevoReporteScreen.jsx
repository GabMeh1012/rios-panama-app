import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { tiposContaminacion, marcasCategorias, identificarRio } from "../data/seedReports";
import TipoIcon from "./TipoIcon";

const pinIcon = new L.DivIcon({
  html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:#0a3d47;transform:rotate(-45deg);border:2px solid #fff"></div>',
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

function ClicMapa({ onMover }) {
  useMapEvents({
    click(e) {
      onMover(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function NuevoReporteScreen({ onBack, onGuardar }) {
  const [foto, setFoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [buscandoGps, setBuscandoGps] = useState(false);
  const [nombreDetectado, setNombreDetectado] = useState(null);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [categoriaMarca, setCategoriaMarca] = useState(marcasCategorias[0].id);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState({}); // { "plast__Coca-Cola": true, ... }
  const [otraMarca, setOtraMarca] = useState("");
  const [severidad, setSeveridad] = useState("moderado");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  function handleFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(URL.createObjectURL(file));
    if (!coords) pedirUbicacion();
  }

  function ubicar(lat, lng) {
    setCoords({ lat, lng });
    const { rio } = identificarRio(lat, lng);
    setNombreDetectado(rio === "Punto sin identificar" ? null : rio);
  }



  function pedirUbicacion() {
    setBuscandoGps(true);
    if (!navigator.geolocation) {
      ubicar(8.98, -79.52);
      setBuscandoGps(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ubicar(pos.coords.latitude, pos.coords.longitude);
        setBuscandoGps(false);
      },
      () => {
        setCoords({ lat: 8.98, lng: -79.52, simulada: true });
        setNombreDetectado(null);
        setBuscandoGps(false);
      }
    );
  }

  function moverPin(lat, lng) {
    ubicar(lat, lng);
  }

  function toggleTipo(tipoLabel) {
    setTiposSeleccionados((prev) =>
      prev.includes(tipoLabel) ? prev.filter((t) => t !== tipoLabel) : [...prev, tipoLabel]
    );
  }

  function toggleMarca(catId, brand) {
    const key = `${catId}__${brand}`;
    setMarcasSeleccionadas((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const marcasElegidas = Object.keys(marcasSeleccionadas)
    .filter((k) => marcasSeleccionadas[k])
    .map((k) => k.split("__")[1]);
  const categoriaActiva = marcasCategorias.find((c) => c.id === categoriaMarca) ?? marcasCategorias[0];

  function handleSubmit() {
    if (!foto) return setError("Agrega una foto del río.");
    if (!coords) return setError("Marca la ubicación en el mapa (o toca la foto para detectarla).");
    if (tiposSeleccionados.length === 0) return setError("Elige al menos un tipo de contaminación.");
    setError("");
    const { rio, provincia, corregimiento } = identificarRio(coords.lat, coords.lng);
    const marcas = [...marcasElegidas, ...(otraMarca.trim() ? [otraMarca.trim()] : [])];
    onGuardar({
      rio,
      provincia,
      corregimiento,
      lat: coords.lat,
      lng: coords.lng,
      tipos: tiposSeleccionados,
      tipo: tiposSeleccionados[0],
      marcas: marcas.length ? marcas : null,
      severidad,
      descripcion: descripcion.trim() || "Sin descripción adicional.",
      foto,
    });
  }

  return (
    <div className="screen">
      <div className="form-section">
        <label className="photo-box" htmlFor="foto-input">
          {foto ? (
            <img src={foto} alt="Foto del río capturada" />
          ) : (
            <>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1f7a6c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              <span>Tomar o subir foto del río</span>
              <span style={{ fontSize: 11 }}>Toca para abrir la cámara</span>
            </>
          )}
        </label>
        <input
          id="foto-input"
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFoto}
        />

        <label className="field-label">Ubicación</label>
        {coords ? (
          <>
            <div style={{ height: 130, borderRadius: 12, overflow: "hidden", marginBottom: 4 }}>
              <MapContainer center={[coords.lat, coords.lng]} zoom={14} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[coords.lat, coords.lng]}
                  icon={pinIcon}
                  draggable
                  eventHandlers={{ dragend: (e) => moverPin(e.target.getLatLng().lat, e.target.getLatLng().lng) }}
                />
                <ClicMapa onMover={moverPin} />
              </MapContainer>
            </div>
            <div className="gps-row">
              📍 {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              {coords.simulada ? " (simulada — activa el GPS del navegador)" : ""}
            </div>
            {nombreDetectado ? (
              <div style={{ fontSize: 11.5, color: "var(--teal)", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Detectado: {nombreDetectado} — corrígelo arrastrando el pin si no es exacto.
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 14 }}>
                No reconocemos un río conocido en este punto — arrastra el pin o toca el mapa para ajustar. Se guardará como "Punto sin identificar" hasta que alguien lo confirme.
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="submit-btn"
            style={{ background: "var(--gray-bg)", color: "var(--navy)", boxShadow: "none", marginBottom: 14 }}
            onClick={pedirUbicacion}
          >
            {buscandoGps ? "Buscando ubicación..." : "Usar mi ubicación actual"}
          </button>
        )}

        <label className="field-label">Tipo de contaminación (elige una o más)</label>
        <div className="tipo-grid">
          {tiposContaminacion.map((t) => {
            const activo = tiposSeleccionados.includes(t.label);
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleTipo(t.label)}
                className={`tipo-tile ${activo ? "active" : ""}`}
              >
                <span className="icon-wrap">
                  <TipoIcon id={t.id} />
                </span>
                <span style={{ flex: 1 }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <label className="field-label" style={{ marginBottom: 0 }}>
            Marcas observadas <span style={{ color: "#9fb3b0" }}>(opcional)</span>
          </label>
          {marcasElegidas.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)" }}>
              {marcasElegidas.length} {marcasElegidas.length === 1 ? "marca seleccionada" : "marcas seleccionadas"}
            </span>
          )}
        </div>

        <div className="brand-tabs">
          {marcasCategorias.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setCategoriaMarca(c.id)}
              className={`brand-tab ${categoriaMarca === c.id ? "active" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="brand-panel">
          <div className="brand-hint">{categoriaActiva.hint}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {categoriaActiva.brands.map((b) => {
              const key = `${categoriaActiva.id}__${b}`;
              const activo = !!marcasSeleccionadas[key];
              return (
                <button
                  type="button"
                  key={b}
                  onClick={() => toggleMarca(categoriaActiva.id, b)}
                  className={`brand-chip ${activo ? "active" : ""}`}
                >
                  {activo && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        <label className="field-label">¿Otra marca no listada?</label>
        <input
          className="field"
          placeholder="Ej. nombre en el empaque o envase"
          value={otraMarca}
          onChange={(e) => setOtraMarca(e.target.value)}
        />

        <label className="field-label">Severidad</label>
        <div className="severity-row">
          {["leve", "moderado", "critico"].map((s) => (
            <div
              key={s}
              className={`severity-pill ${s} ${severidad === s ? "selected" : ""}`}
              onClick={() => setSeveridad(s)}
            >
              {s === "leve" ? "Leve" : s === "moderado" ? "Moderado" : "Crítico"}
            </div>
          ))}
        </div>

        <label className="field-label">Descripción (opcional)</label>
        <textarea
          className="field"
          rows={3}
          placeholder="¿Qué observas? Color del agua, olor, basura, peces muertos..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="submit-btn" onClick={handleSubmit}>
          Enviar reporte
        </button>
      </div>
    </div>
  );
}
