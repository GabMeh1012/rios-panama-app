const nombresMes = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

// Grupo al que pertenece una fecha en la lista de "Reportes recientes":
// "Hoy", "Esta semana" (últimos 7 días) o "Anteriores".
export function grupoDeFecha(fechaStr) {
  const hoy = new Date();
  if (fechaStr >= hoy.toISOString().slice(0, 10)) return "Hoy";
  const haceUnaSemana = new Date(hoy);
  haceUnaSemana.setDate(hoy.getDate() - 7);
  if (fechaStr >= haceUnaSemana.toISOString().slice(0, 10)) return "Esta semana";
  return "Anteriores";
}

// "Hoy", "Ayer" o la fecha formateada, calculado con la fecha real del
// dispositivo (no es un texto fijo). Se usa tanto en el detalle del río como
// en la lista de "Reportes recientes".
export function formatearFechaRelativa(fechaStr) {
  const hoy = new Date();
  const hoyStr = hoy.toISOString().slice(0, 10);
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const ayerStr = ayer.toISOString().slice(0, 10);
  if (fechaStr === hoyStr) return "Hoy";
  if (fechaStr === ayerStr) return "Ayer";
  const [, mes, dia] = fechaStr.split("-");
  return `${parseInt(dia, 10)} ${nombresMes[mes]}`;
}
