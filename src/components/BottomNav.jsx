const tabs = [
  { id: "inicio", label: "Inicio" },
  { id: "mapa", label: "Mapa" },
  { id: "comunidad", label: "Comunidad" },
  { id: "perfil", label: "Perfil" },
];

function Icono({ id }) {
  const props = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (id === "inicio") {
    return (
      <svg {...props}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 9.5V20h13V9.5" />
      </svg>
    );
  }
  if (id === "mapa") {
    return (
      <svg {...props}>
        <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.4" />
      </svg>
    );
  }
  if (id === "comunidad") {
    return (
      <svg {...props}>
        <circle cx="9" cy="8" r="3" />
        <path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5" />
        <circle cx="17" cy="8.5" r="2.3" />
        <path d="M15.8 14.7c2.3.3 4 2 4.7 5.3" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

// Barra de navegación inferior, estilo app moderna. `activo` marca qué
// pestaña resaltar; onSelect recibe el id de la pestaña tocada.
export default function BottomNav({ activo, onSelect }) {
  return (
    <div className="bottom-nav">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`nav-item ${activo === t.id ? "active" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <Icono id={t.id} />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
