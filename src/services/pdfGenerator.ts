// Instalar: npm install jspdf
import jsPDF from "jspdf";

export interface PlanMeta {
  docente: string;
  institucion: string;
  materia: string;
  grado: string;
  fecha: string;
  tema: string;
  objetivo: string;
  duracion: string;
}

interface Seccion {
  titulo: string;
  contenido: string;
  tiempo?: string;
}

function limpiarMarkdown(texto: string): string {
  return texto.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
}

function parsearSecciones(texto: string): Seccion[] {
  const norm = texto.replace(/\*\*([A-ZÁÉÍÓÚÑ\s]+)\*\*/g, (_, t) => t.trim());
  const secciones: Seccion[] = [];
  const PATRONES = [
    { titulo: "OBJETIVO",              regex: /OBJETIVO\s*\n([\s\S]*?)(?=\nCONTENIDOS|\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { titulo: "CONTENIDOS",            regex: /CONTENIDOS\s*\n([\s\S]*?)(?=\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { titulo: "INICIO",                regex: /(INICIO|SITUACIÓN DISPARADORA)\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i, esInicio: true },
    { titulo: "DESARROLLO",            regex: /DESARROLLO\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i, tieneGrupo: true },
    { titulo: "CIERRE",                regex: /CIERRE\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i, tieneGrupo: true },
    { titulo: "RECURSOS",              regex: /RECURSOS\s*\n([\s\S]*?)(?=\nEVALUACIÓN|\nTIPS|$)/i },
    { titulo: "EVALUACIÓN",            regex: /EVALUACIÓN\s*\n([\s\S]*?)(?=\nTIPS|$)/i },
    { titulo: "TIPS PARA EL DOCENTE",  regex: /TIPS PARA EL DOCENTE\s*\n([\s\S]*?)$/i },
  ] as const;

  for (const p of PATRONES) {
    const match = norm.match(p.regex);
    if (!match) continue;
    if ('esInicio' in p && p.esInicio) {
      const esDisp = match[1]?.toUpperCase().includes("DISPARADORA");
      secciones.push({ titulo: esDisp ? "SITUACIÓN DISPARADORA" : "INICIO", contenido: limpiarMarkdown((match[3] || "").trim()), tiempo: match[2] });
    } else if ('tieneGrupo' in p && p.tieneGrupo) {
      secciones.push({ titulo: p.titulo, contenido: limpiarMarkdown((match[2] || "").trim()), tiempo: match[1] });
    } else {
      secciones.push({ titulo: p.titulo, contenido: limpiarMarkdown((match[1] || "").trim()) });
    }
  }
  return secciones;
}

const COLORES: Record<string, { bg: [number,number,number]; titulo: [number,number,number]; borde: [number,number,number] }> = {
  "OBJETIVO":              { bg: [235, 242, 255], titulo: [30, 80, 180],  borde: [180, 210, 255] },
  "CONTENIDOS":            { bg: [240, 235, 255], titulo: [90, 30, 180],  borde: [200, 180, 255] },
  "INICIO":                { bg: [255, 248, 225], titulo: [150, 90, 0],   borde: [255, 220, 130] },
  "SITUACIÓN DISPARADORA": { bg: [255, 248, 225], titulo: [150, 90, 0],   borde: [255, 220, 130] },
  "DESARROLLO":            { bg: [230, 250, 240], titulo: [20, 130, 80],  borde: [160, 230, 200] },
  "CIERRE":                { bg: [255, 242, 230], titulo: [180, 80, 20],  borde: [255, 200, 150] },
  "RECURSOS":              { bg: [240, 242, 245], titulo: [60, 70, 90],   borde: [190, 200, 215] },
  "EVALUACIÓN":            { bg: [255, 235, 238], titulo: [180, 30, 60],  borde: [255, 180, 190] },
  "TIPS PARA EL DOCENTE":  { bg: [255, 252, 220], titulo: [140, 100, 0],  borde: [230, 210, 100] },
};

export function descargarPlanificacionPDF(content: string, meta: PlanMeta, tipo: "free" | "pro") {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const MARGEN = 16;
  const ANCHO = W - MARGEN * 2;
  let y = 0;

  // ── HEADER con degradado simulado ──────────────────────────
  // Fondo principal coral
  doc.setFillColor(208, 74, 44);
  doc.rect(0, 0, W, 42, "F");
  // Franja inferior más clara para efecto warm
  doc.setFillColor(225, 110, 75);
  doc.rect(0, 30, W, 12, "F");
  // Línea decorativa inferior
  doc.setFillColor(245, 160, 110);
  doc.rect(0, 40, W, 2, "F");

  // OHANA título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 248, 240);
  doc.text("OHANA", MARGEN, 17);

  // Separador vertical
  doc.setDrawColor(255, 200, 170);
  doc.setLineWidth(0.4);
  doc.line(MARGEN + 42, 9, MARGEN + 42, 24);

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 220, 200);
  doc.text("Consultora Educativa", MARGEN + 46, 14);
  doc.text("Planificación Inteligente", MARGEN + 46, 20);

  // Badge PRO / FREE
  if (tipo === "pro") {
    doc.setFillColor(255, 210, 120);
    doc.roundedRect(W - MARGEN - 20, 8, 20, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 50, 0);
    doc.text("PRO", W - MARGEN - 10, 13.5, { align: "center" });
  }

  // Tema de la clase en el header inferior
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 240, 225);
  const temaCorto = meta.tema.length > 80 ? meta.tema.slice(0, 77) + "..." : meta.tema;
  doc.text(temaCorto, MARGEN, 36);

  y = 50;

  // ── DATOS GENERALES ─────────────────────────────────────────
  doc.setFillColor(252, 247, 242);
  doc.setDrawColor(225, 200, 180);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, 32, 2.5, 2.5, "FD");

  // Línea coral izquierda
  doc.setFillColor(208, 74, 44);
  doc.rect(MARGEN, y, 3, 32, "F");

  y += 7;
  const col1 = MARGEN + 8;
  const col2 = MARGEN + ANCHO / 2 + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(120, 70, 40);
  doc.text("DOCENTE", col1, y);
  doc.text("INSTITUCIÓN", col2, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 30, 20);
  doc.text(meta.docente || "—", col1, y);
  doc.text(meta.institucion || "—", col2, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(120, 70, 40);
  doc.text("MATERIA", col1, y);
  doc.text("AÑO / GRADO", col2, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 30, 20);
  doc.text(meta.materia || "—", col1, y);
  doc.text(meta.grado || "—", col2, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(120, 70, 40);
  doc.text("FECHA", col1, y);
  doc.text("DURACIÓN", col2, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 30, 20);
  doc.text(meta.fecha || "—", col1, y);
  doc.text(`${meta.duracion} minutos`, col2, y);

  y += 10; // espacio antes de secciones

  // ── SECCIONES ───────────────────────────────────────────────
  const secciones = parsearSecciones(content);
  const PADDING_V = 5;
  const PADDING_H = 6;
  const GAP = 4; // espacio entre secciones

  for (const seccion of secciones) {
    const color = COLORES[seccion.titulo] || COLORES["RECURSOS"];

    doc.setFontSize(8.5);
    const lineasContenido = doc.splitTextToSize(seccion.contenido, ANCHO - PADDING_H * 2);
    const alturaContenido = lineasContenido.length * 4;
    const alturaBloque = PADDING_V + 5 + PADDING_V / 2 + alturaContenido + PADDING_V;

    // Nueva página si no entra (con margen de footer)
    if (y + alturaBloque > 275) {
      doc.addPage();
      y = 18;
    }

    // Fondo de sección
    doc.setFillColor(...color.bg);
    doc.setDrawColor(...color.borde);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGEN, y, ANCHO, alturaBloque, 2.5, 2.5, "FD");

    // Línea izquierda de color
    doc.setFillColor(...color.titulo);
    doc.rect(MARGEN, y, 3, alturaBloque, "F");

    // Título de sección
    const yTitulo = y + PADDING_V + 1;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...color.titulo);
    const tituloTexto = seccion.tiempo ? `${seccion.titulo}   (${seccion.tiempo})` : seccion.titulo;
    doc.text(tituloTexto, MARGEN + PADDING_H, yTitulo);

    // Línea separadora bajo el título
    doc.setDrawColor(...color.borde);
    doc.setLineWidth(0.3);
    doc.line(MARGEN + PADDING_H, yTitulo + 2, MARGEN + ANCHO - PADDING_H, yTitulo + 2);

    // Contenido
    const yContenido = yTitulo + 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 35, 28);
    doc.text(lineasContenido, MARGEN + PADDING_H, yContenido);

    y += alturaBloque + GAP; // ← espacio entre secciones
  }

  // ── FOOTER en cada página ───────────────────────────────────
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFillColor(252, 245, 238);
    doc.rect(0, 286, W, 11, "F");
    doc.setDrawColor(225, 200, 175);
    doc.setLineWidth(0.3);
    doc.line(0, 286, W, 286);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(160, 120, 90);
    doc.text("Generado por Ohana Planificacion Inteligente", MARGEN, 292);
    doc.setFont("helvetica", "bold");
    doc.text(`Pagina ${i} de ${totalPaginas}`, W - MARGEN, 292, { align: "right" });
  }

  // ── DESCARGA ─────────────────────────────────────────────────
  const nombre = `Ohana_${meta.materia}_${meta.grado}_${meta.fecha}`
    .replace(/\s+/g, "_").replace(/[°\/\\:*?"<>|]/g, "");
  doc.save(`${nombre}.pdf`);
}