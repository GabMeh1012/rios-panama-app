import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { tiposContaminacion, identificarRio } from "../data/seedReports";

const pinIcon = new L.DivIcon({
  html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:#A32D2D;transform:rotate(-45deg);border:2px solid #fff"></div>',
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
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [marca, setMarca] = useState("");
  const [severidad, setSeveridad] = useState("moderado");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  function handleFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(URL.createObjectURL(file));
    if (!coords) pedirUbicacion();
  }

  function pedirUbicacion() {
    setBuscandoGps(true);
    if (!navigator.geolocation) {
      setCoords({ lat: 8.98, lng: -79.52, simulada: true });
      setBuscandoGps(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setBuscandoGps(false);
      },
      () => {
        setCoords({ lat: 8.98, lng: -79.52, simulada: true });
        setBuscandoGps(false);
      }
    );
  }

  function moverPin(lat, lng) {
    setCoords({ lat, lng });
  }

  function toggleTipo(tipo) {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  }

  function handleSubmit() {
    if (!foto) return setError("Agrega una foto del río.");
    if (!coords) return setError("Marca la ubicación en el mapa (o toca la foto para detectarla).");
    if (tiposSeleccionados.length === 0) return setError("Elige al menos un tipo de contaminación.");
    setError("");
    const { rio, provincia } = identificarRio(coords.lat, coords.lng);
    onGuardar({
      rio,
      provincia,
      lat: coords.lat,
      lng: coords.lng,
      tipos: tiposSeleccionados,
      tipo: tiposSeleccionados[0],
      marca: marca.trim() || null,
      severidad,
      descripcion: descripcion.trim() || "Sin descripción adicional.",
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

        <label className="field-label">Ubicación (detectada automáticamente)</label>
        {coords ? (
          <>
            <div style={{ height: 130, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
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
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 14 }}>
              Arrastra el pin o toca el mapa si el punto no es exacto.
            </div>
          </>
        ) : (
          <button
            type="button"
            className="submit-btn"
            style={{ background: "var(--gray-bg)", color: "var(--navy)", marginBottom: 14 }}
            onClick={pedirUbicacion}
          >
            {buscandoGps ? "Buscando ubicación..." : "Detectar mi ubicación"}
          </button>
        )}

        <label className="field-label">Tipo de contaminación (elige una o más)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {tiposContaminacion.map((t) => {
            const activo = tiposSeleccionados.includes(t);
            return (
              <span
                key={t}
                onClick={() => toggleTipo(t)}
                style={{
                  fontSize: 11,
                  padding: "6px 10px",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontWeight: activo ? 500 : 400,
                  background: activo ? "#EF9F27" : "transparent",
                  color: activo ? "#412402" : "var(--text-secondary)",
                  border: activo ? "none" : "0.5px solid var(--border-strong)",
                }}
              >
                {t}
              </span>
            );
          })}
        </div>

        <label className="field-label">¿Ves marca de alguna empresa? (opcional)</label>
        <input
          className="field"
          placeholder="Ej. nombre en el empaque o envase"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
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
