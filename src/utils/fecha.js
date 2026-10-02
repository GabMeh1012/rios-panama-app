const nombresMes = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

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
