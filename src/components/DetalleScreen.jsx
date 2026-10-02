import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getInfoGeneral } from "../data/riosInfo";
import { formatearFechaRelativa } from "../utils/fecha";

const labelSeveridad = { critico: "Crítico", moderado: "Moderado", leve: "Leve" };
const colorPorSeveridad = { critico: "#d64545", moderado: "#e0a52c", leve: "#2f9e63" };

// Genera un color "de firma" propio de cada río (siempre el mismo para el
// mismo nombre), para que la portada del detalle se sienta distinta de río
// en río aunque todavía no haya una foto real. No es un dato inventado: es
// solo una paleta derivada matemáticamente del nombre real del río.
function hashCadena(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function temaDelRio(nombreRio) {
  const hue = hashCadena(nombreRio) % 360;
  return {
    deep: `hsl(${hue}, 40%, 20%)`,
    mid: `hsl(${(hue + 35) % 360}, 46%, 36%)`,
  };
}

export default function DetalleScreen({ report, reports, focoCritico, tendencia, onEscalar }) {
  const yaEscalado = report.estado === "enviado a autoridad";
  const tema = temaDelRio(report.rio);

  // Todos los reportes de este mismo río (cada uno puede ser un tramo distinto),
  // ordenados del más reciente al más antiguo.
  const delMismoRio = [...reports.filter((r) => r.rio === report.rio)].sort((a, b) =>
    b.fecha.localeCompare(a.fecha)
  );
  const fechaMasReciente = delMismoRio[0].fecha;

  const maxTotal = Math.max(1, ...tendencia.map((t) => t.total));
  const totalTendencia = tendencia.reduce((a, t) => a + t.total, 0);

  // Dirección de la tendencia: compara la primera mitad de los últimos 30
  // días contra la segunda mitad (más estable que comparar solo dos bloques).
  let tendenciaTexto = "Sin datos suficientes";
  let tendenciaColor = "var(--text-secondary)";
  if (totalTendencia > 0) {
    const mitad = Math.floor(tendencia.length / 2);
    const primeraMitad = tendencia.slice(0, mitad).reduce((a, t) => a + t.total, 0);
    const segundaMitad = tendencia.slice(mitad).reduce((a, t) => a + t.total, 0);
    if (segundaMitad > primeraMitad) {
      tendenciaTexto = "↑ Empeorando";
      tendenciaColor = "var(--critico)";
    } else if (segundaMitad < primeraMitad) {
      tendenciaTexto = "↓ Mejorando";
      tendenciaColor = "var(--leve)";
    } else {
      tendenciaTexto = "→ Estable";
      tendenciaColor = "var(--moderado)";
    }
  }

  // Contaminantes más comunes reportados en este río, calculado a partir de
  // los datos reales de los reportes (no son cifras inventadas). Las "marcas
  // observadas" se incluyen como una categoría más, junto a los tipos de
  // contaminación, tal como se pidió para esta pantalla.
  const conteoTipos = {};
  delMismoRio.forEach((r) => {
    const lista = r.tipos && r.tipos.length ? r.tipos : [r.tipo];
    lista.forEach((t) => {
      conteoTipos[t] = (conteoTipos[t] || 0) + 1;
    });
  });
  const reportesConMarcas = delMismoRio.filter((r) => r.marcas && r.marcas.length > 0).length;

  const categorias = Object.entries(conteoTipos).map(([label, cant]) => ({ label, cant }));
  if (reportesConMarcas > 0) {
    categorias.push({ label: "Marcas / envases identificados", cant: reportesConMarcas });
  }
  const totalCategorias = categorias.reduce((a, c) => a + c.cant, 0) || 1;
  const categoriasOrdenadas = categorias.sort((a, b) => b.cant - a.cant).slice(0, 4);

  // Marcas observadas en todos los reportes de este río, para el pie de nota.
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

  // Información GENERAL del río (cuenca, longitud, uso, inspección oficial) —
  // no se calcula a partir de los reportes, es un dato propio del río.
  const infoGeneral = getInfoGeneral(report.rio);

  return (
    <div className="screen">
      {/* Portada del río: foto real si existe, o si no, un color "de firma"
          propio de ese río (siempre el mismo para el mismo nombre) con una
          textura de olas, para que cada río se sienta distinto de un
          vistazo aunque todavía no tenga fotos. */}
      <div
        className="detail-hero"
        style={
          report.foto
            ? { backgroundImage: `url(${report.foto})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: `linear-gradient(135deg, ${tema.deep}, ${tema.mid} 75%)` }
        }
      >
        {!report.foto && (
          <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="detail-hero-waves" aria-hidden="true">
            <path d="M0 120Q100 90 200 115T400 100V200H0Z" fill="#fff" opacity="0.08" />
            <path d="M0 150Q100 125 200 145T400 130V200H0Z" fill="#fff" opacity="0.1" />
            <path d="M0 176Q100 156 200 171T400 160V200H0Z" fill="#fff" opacity="0.14" />
          </svg>
        )}
        <div className="detail-hero-scrim" />
        <div className="detail-hero-text">
          <span className="logo-type detail-hero-title">{report.rio}</span>
          <div className="detail-hero-tags">
            <span className={`badge ${report.severidad}`}>{labelSeveridad[report.severidad]}</span>
            <span className="detail-hero-tipo">{report.tipos ? report.tipos.join(", ") : report.tipo}</span>
          </div>
        </div>
      </div>
      <div className="detail-body">
        <p className="detail-meta" style={{ marginTop: 0 }}>
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

      {/* Resumen rápido de los REPORTES de este río, como en el wireframe. */}
      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-tile-label">Reportes totales</div>
          <div className="stat-tile-value">{delMismoRio.length}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Última actualización</div>
          <div className="stat-tile-value" style={{ fontSize: 15 }}>{formatearFechaRelativa(fechaMasReciente)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Corregimiento</div>
          <div className="stat-tile-value" style={{ fontSize: 15 }}>{report.corregimiento || "Por confirmar"}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Tendencia</div>
          <div className="stat-tile-value" style={{ fontSize: 15, color: tendenciaColor }}>{tendenciaTexto}</div>
        </div>
      </div>

      {categoriasOrdenadas.length > 0 && (
        <>
          <div className="section-title">Contaminantes más comunes</div>
          <div className="info-card">
            {categoriasOrdenadas.map((c) => {
              const pct = Math.round((c.cant / totalCategorias) * 100);
              return (
                <div className="stat-bar-row" key={c.label}>
                  <div className="stat-bar-label">
                    <span>{c.label}</span>
                    <b>{pct}%</b>
                  </div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{ width: `${pct}%`, background: "var(--teal)" }} />
                  </div>
                </div>
              );
            })}
            {marcasOrdenadas.length > 0 && (
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "10px 0 0" }}>
                Envases más reportados en este río: {marcasOrdenadas.slice(0, 3).map(([m]) => m).join(", ")}.
              </p>
            )}
          </div>
        </>
      )}

      <div className="section-title">Tendencia · últimos 30 días</div>
      <div style={{ margin: "0 16px 18px" }}>
        {totalTendencia > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
              {tendencia.map((t, i) => (
                <div key={t.inicio} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      height: `${(t.total / maxTotal) * 50 + 6}px`,
                      background: i === tendencia.length - 1
                        ? "linear-gradient(180deg, var(--critico), #8a2f2f)"
                        : "linear-gradient(180deg, var(--teal), var(--navy))",
                      borderRadius: 4,
                    }}
                    title={`${t.total} reportes`}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Hace 30 días</span>
              <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Hoy</span>
            </div>
          </>
        ) : (
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Aún no hay reportes recientes (últimos 30 días) para graficar una tendencia.
          </p>
        )}
      </div>

      <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span>Fotos de la comunidad</span>
        {fotos.length > 0 && (
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)" }}>
            {fotos.length} {fotos.length === 1 ? "foto" : "fotos"}
          </span>
        )}
      </div>
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

      {/* Información GENERAL del río (no de los reportes): cuenca, longitud,
          uso principal, última inspección oficial. Si no tenemos datos
          verificados para este río, se dice honestamente en vez de inventar. */}
      <div className="section-title">Información adicional</div>
      {infoGeneral ? (
        <dl className="info-card">
          <dt>Cuenca hidrográfica</dt>
          <dd>{infoGeneral.cuenca}</dd>
          <dt>Longitud aproximada</dt>
          <dd>{infoGeneral.longitud}</dd>
          <dt>Uso principal</dt>
          <dd>{infoGeneral.usoPrincipal}</dd>
          <dt>Última inspección oficial</dt>
          <dd>{infoGeneral.ultimaInspeccion}</dd>
        </dl>
      ) : (
        <p style={{ margin: "0 16px 18px", fontSize: 12, color: "var(--text-secondary)" }}>
          Aún no tenemos información general verificada para este río (cuenca, longitud, uso principal). Solo se
          muestran los datos que sí vienen de reportes reales de la comunidad.
        </p>
      )}

      <div className="section-title">Reportes a lo largo del río</div>
      <div className="info-card" style={{ padding: 10 }}>
        <div style={{ borderRadius: 10, overflow: "hidden", height: 150 }}>
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
        <p style={{ fontSize: 12, fontWeight: 600, margin: "10px 0 2px" }}>
          {delMismoRio.length} {delMismoRio.length === 1 ? "tramo con reporte activo" : "tramos con reportes activos"}
        </p>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
          Cada punto representa un tramo de este río reportado por la comunidad, ubicado según sus coordenadas GPS.
        </p>
      </div>

      {/* Historial de reportes de este río, más reciente primero. */}
      <div className="section-title">Historial de reportes</div>
      <div className="info-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            {delMismoRio.slice(0, 8).map((r) => (
              <tr key={r.id}>
                <td>{formatearFechaRelativa(r.fecha)}</td>
                <td>{r.tipos ? r.tipos.join(", ") : r.tipo}</td>
                <td style={{ color: colorPorSeveridad[r.severidad], fontWeight: 700 }}>
                  {labelSeveridad[r.severidad]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {delMismoRio.length > 8 && (
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, padding: "8px 14px" }}>
            Mostrando los 8 reportes más recientes de {delMismoRio.length} en total.
          </p>
        )}
      </div>

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
