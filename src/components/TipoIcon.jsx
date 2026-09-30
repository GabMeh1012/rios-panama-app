// Íconos de línea (estilo Feather/Lucide) para cada tipo de contaminación.
// Se usan tanto en el formulario de "Nuevo reporte" como en los filtros del mapa.
export default function TipoIcon({ id, size = 15 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (id) {
    case "neg":
      return (
        <svg {...common}>
          <path d="M12 2s7 7.6 7 12a7 7 0 1 1-14 0c0-4.4 7-12 7-12z" />
        </svg>
      );
    case "ind":
      return (
        <svg {...common}>
          <path d="M3 21V9l5 3V9l5 3V9l6 3v9H3z" />
          <path d="M3 21h18" />
        </svg>
      );
    case "bas":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          <path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12" />
        </svg>
      );
    case "pla":
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12v9M4 7.5l8 4.5 8-4.5" />
        </svg>
      );
    case "sed":
      return (
        <svg {...common}>
          <path d="M12 3 3 8l9 5 9-5-9-5z" />
          <path d="M3 13l9 5 9-5" />
        </svg>
      );
    case "agro":
      return (
        <svg {...common}>
          <path d="M9 2v6L4.5 18.5A1.2 1.2 0 0 0 5.6 20h12.8a1.2 1.2 0 0 0 1.1-1.5L15 8V2" />
          <path d="M9 2h6" />
          <path d="M6.5 15h11" />
        </svg>
      );
    case "ace":
      return (
        <svg {...common}>
          <path d="M4 22V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v13" />
          <path d="M13 22v-9h3a2 2 0 0 1 2 2v7" />
          <circle cx="15" cy="8.3" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "esc":
      return (
        <svg {...common}>
          <path d="M12 3 2 20h20L12 3z" />
          <path d="M12 10.5v4" />
          <circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "olo":
      return (
        <svg {...common}>
          <path d="M3 8h10a2.3 2.3 0 1 0-1.8-3.8" />
          <path d="M3 13h13.5a2.3 2.3 0 1 1-1.8 3.8" />
        </svg>
      );
    case "fau":
      return (
        <svg {...common}>
          <path d="M3 12s3.3-5 9-5 9 5 9 5-3.3 5-9 5-9-5-9-5z" />
          <circle cx="16.3" cy="11" r=".8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "critico":
      return (
        <svg {...common}>
          <path d="M12 3 2 20h20L12 3z" />
          <path d="M12 9v5" />
          <circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}
