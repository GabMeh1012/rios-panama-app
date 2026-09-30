import { useEffect, useState } from "react";
import { seedReports } from "./seedReports";

const STORAGE_KEY = "rios_panama_reports";
const PENDING_KEY = "rios_panama_pendientes"; // reportes creados sin conexión

// Este hook simula una base de datos usando localStorage, para que el
// prototipo funcione sin backend. Para producción, reemplaza getAll/addReport
// por llamadas a Firebase Firestore (ver README.md, sección "Conectar Firebase").
export function useReports() {
  const [reports, setReports] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setReports(saved ? JSON.parse(saved) : seedReports);
    const pend = localStorage.getItem(PENDING_KEY);
    setPendientes(pend ? JSON.parse(pend) : []);

    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Cuando vuelve la conexión, sincroniza los reportes pendientes automáticamente.
  useEffect(() => {
    if (online && pendientes.length > 0) {
      const combinados = [...pendientes, ...reports];
      persistReports(combinados);
      persistPendientes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  function persistReports(next) {
    setReports(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function persistPendientes(next) {
    setPendientes(next);
    localStorage.setItem(PENDING_KEY, JSON.stringify(next));
  }

  function addReport(datos) {
    const nuevo = {
      ...datos,
      id: `r${Date.now()}`,
      fecha: new Date().toISOString().slice(0, 10),
      confirmaciones: 0,
      estado: "nuevo",
    };

    if (!navigator.onLine) {
      // Sin conexión: se guarda en la cola de pendientes y se sincroniza después.
      persistPendientes([nuevo, ...pendientes]);
      return { ...nuevo, sinConexion: true };
    }

    persistReports([nuevo, ...reports]);
    return nuevo;
  }

  // Regla simple de alerta: 3+ reportes activos sobre el mismo río -> foco crítico.
  function tieneFocoCritico(rio) {
    return reports.filter((r) => r.rio === rio).length >= 3;
  }

  // Escala un reporte a la autoridad correspondiente (simulado para el prototipo).
  function escalarReporte(id) {
    const next = reports.map((r) => (r.id === id ? { ...r, estado: "enviado a autoridad" } : r));
    persistReports(next);
  }

  // Agrupa los reportes de un río por mes, para la tendencia histórica.
  function tendenciaPorMes(rio) {
    const conteos = {};
    reports
      .filter((r) => r.rio === rio)
      .forEach((r) => {
        const mes = r.fecha.slice(0, 7); // "2026-08"
        conteos[mes] = (conteos[mes] || 0) + 1;
      });
    return Object.entries(conteos)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, total]) => ({ mes, total }));
  }

  return {
    reports,
    pendientes,
    online,
    addReport,
    tieneFocoCritico,
    escalarReporte,
    tendenciaPorMes,
  };
}
