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
  return texto
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*\*/g, "$1")
    .replace(/^\s*[-•]\s/gm, "  • ")
    .trim();
}

function parsearSecciones(texto: string): Seccion[] {
  const norm = texto.replace(/\*\*([A-ZÁÉÍÓÚÑ\s]+)\*\*/g, (_, t) => t.trim());
  const secciones: Seccion[] = [];
  const PATRONES = [
    {
      titulo: "OBJETIVO",
      regex:
        /OBJETIVO\s*\n([\s\S]*?)(?=\nCONTENIDOS|\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i,
    },
    {
      titulo: "CONTENIDOS",
      regex:
        /CONTENIDOS\s*\n([\s\S]*?)(?=\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i,
    },
    {
      titulo: "INICIO",
      regex:
        /(INICIO|SITUACIÓN DISPARADORA)\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i,
      esInicio: true,
    },
    {
      titulo: "DESARROLLO",
      regex:
        /DESARROLLO\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i,
      tieneGrupo: true,
    },
    {
      titulo: "CIERRE",
      regex:
        /CIERRE\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i,
      tieneGrupo: true,
    },
    {
      titulo: "RECURSOS",
      regex: /RECURSOS\s*\n([\s\S]*?)(?=\nEVALUACIÓN|\nTIPS|$)/i,
    },
    { titulo: "EVALUACIÓN", regex: /EVALUACIÓN\s*\n([\s\S]*?)(?=\nTIPS|$)/i },
    {
      titulo: "TIPS PARA EL DOCENTE",
      regex: /TIPS PARA EL DOCENTE\s*\n([\s\S]*?)$/i,
    },
  ] as const;

  for (const p of PATRONES) {
    const match = norm.match(p.regex);
    if (!match) continue;
    if ("esInicio" in p && p.esInicio) {
      const esDisp = match[1]?.toUpperCase().includes("DISPARADORA");
      secciones.push({
        titulo: esDisp ? "SITUACIÓN DISPARADORA" : "INICIO",
        contenido: limpiarMarkdown((match[3] || "").trim()),
        tiempo: match[2],
      });
    } else if ("tieneGrupo" in p && p.tieneGrupo) {
      secciones.push({
        titulo: p.titulo,
        contenido: limpiarMarkdown((match[2] || "").trim()),
        tiempo: match[1],
      });
    } else {
      secciones.push({
        titulo: p.titulo,
        contenido: limpiarMarkdown((match[1] || "").trim()),
      });
    }
  }
  return secciones;
}

const COLORES: Record<
  string,
  {
    bg: [number, number, number];
    titulo: [number, number, number];
    borde: [number, number, number];
    acento: [number, number, number];
  }
> = {
  OBJETIVO: {
    bg: [240, 246, 255],
    titulo: [30, 80, 180],
    borde: [190, 215, 255],
    acento: [70, 130, 220],
  },
  CONTENIDOS: {
    bg: [245, 240, 255],
    titulo: [90, 30, 170],
    borde: [210, 190, 255],
    acento: [110, 60, 200],
  },
  INICIO: {
    bg: [255, 250, 235],
    titulo: [160, 100, 10],
    borde: [255, 225, 140],
    acento: [180, 120, 20],
  },
  "SITUACIÓN DISPARADORA": {
    bg: [255, 250, 235],
    titulo: [160, 100, 10],
    borde: [255, 225, 140],
    acento: [180, 120, 20],
  },
  DESARROLLO: {
    bg: [235, 252, 242],
    titulo: [15, 130, 80],
    borde: [170, 235, 205],
    acento: [50, 155, 100],
  },
  CIERRE: {
    bg: [255, 244, 237],
    titulo: [185, 85, 25],
    borde: [255, 205, 160],
    acento: [200, 100, 40],
  },
  RECURSOS: {
    bg: [244, 246, 250],
    titulo: [60, 70, 90],
    borde: [200, 210, 225],
    acento: [100, 110, 130],
  },
  EVALUACIÓN: {
    bg: [255, 238, 241],
    titulo: [175, 30, 60],
    borde: [255, 185, 195],
    acento: [195, 60, 85],
  },
  "TIPS PARA EL DOCENTE": {
    bg: [255, 253, 230],
    titulo: [145, 105, 0],
    borde: [235, 220, 110],
    acento: [165, 125, 15],
  },
};

// ─── CONSTANTES DE DISEÑO (ajustables) ────────────────────────
const MARGEN = 18;
const ANCHO_UTIL = 210 - MARGEN * 2;
const INTERLINEADO_TEXTO = 5.2; // mm entre líneas de contenido
const GAP_SECCIONES = 8; // espacio entre bloques de sección
const PADDING_V = 8; // padding vertical dentro de cada bloque
const PADDING_H = 8; // padding horizontal

export function descargarPlanificacionPDF(
  content: string,
  meta: PlanMeta,
  tipo: "free" | "pro",
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  const W = 210;
  let y = 0;

  // ── HEADER ──────────────────────────────────────────────────
  const headerAltura = 48;
  // Fondo principal
  doc.setFillColor(195, 65, 40);
  doc.rect(0, 0, W, headerAltura - 6, "F");
  // Degradado inferior simulado
  doc.setFillColor(215, 95, 60);
  doc.rect(0, headerAltura - 14, W, 8, "F");
  // Línea decorativa
  doc.setFillColor(240, 150, 100);
  doc.rect(0, headerAltura - 6, W, 2.5, "F");

  // Nombre "OHANA"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 250, 242);
  doc.text("OHANA", MARGEN, 16);

  // Separador vertical
  doc.setDrawColor(255, 190, 160);
  doc.setLineWidth(0.5);
  doc.line(MARGEN + 45, 7, MARGEN + 45, 26);

  // Subtítulo consultora
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 210, 190);
  doc.text("Consultora Educativa", MARGEN + 50, 13.5);
  doc.text("Planificación Inteligente", MARGEN + 50, 20);

  // Badge PRO / FREE
  if (tipo === "pro") {
    doc.setFillColor(255, 220, 130);
    doc.roundedRect(W - MARGEN - 22, 7, 22, 9, 2.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(90, 45, 0);
    doc.text("PRO", W - MARGEN - 11, 13, { align: "center" });
  } else {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(W - MARGEN - 24, 7, 24, 9, 2.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 240, 225);
    doc.text("FREE", W - MARGEN - 12, 13, { align: "center" });
  }

  // Tema de la clase en el header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 245, 235);
  const temaCorto =
    meta.tema.length > 90 ? meta.tema.slice(0, 87) + "..." : meta.tema;
  doc.text(temaCorto, MARGEN, headerAltura - 16);

  y = headerAltura + 8;

  // ── BLOQUE DE DATOS GENERALES ────────────────────────────────
  doc.setFillColor(254, 250, 246);
  doc.setDrawColor(220, 195, 170);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGEN, y, ANCHO_UTIL, 38, 3, 3, "FD");

  // Barra lateral de acento
  doc.setFillColor(195, 65, 40);
  doc.rect(MARGEN, y, 3.5, 38, "F");

  const colIzq = MARGEN + 10;
  const colDer = MARGEN + ANCHO_UTIL / 2 + 4;

  // Fila 1
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(140, 85, 50);
  doc.text("DOCENTE", colIzq, y);
  doc.text("INSTITUCIÓN", colDer, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(35, 25, 15);
  doc.text(meta.docente || "—", colIzq, y);
  doc.text(meta.institucion || "—", colDer, y);

  // Fila 2
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(140, 85, 50);
  doc.text("MATERIA", colIzq, y);
  doc.text("AÑO / GRADO", colDer, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(35, 25, 15);
  doc.text(meta.materia || "—", colIzq, y);
  doc.text(meta.grado || "—", colDer, y);

  // Fila 3
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(140, 85, 50);
  doc.text("FECHA", colIzq, y);
  doc.text("DURACIÓN", colDer, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(35, 25, 15);
  doc.text(meta.fecha || "—", colIzq, y);
  doc.text(`${meta.duracion} minutos`, colDer, y);

  y += 14; // espacio antes de secciones

  // ── SECCIONES ───────────────────────────────────────────────
  const secciones = parsearSecciones(content);

  for (const seccion of secciones) {
    const color = COLORES[seccion.titulo] || COLORES["RECURSOS"];

    // Calcular altura del contenido
    doc.setFontSize(9.5);
    const lineasContenido = doc.splitTextToSize(
      seccion.contenido,
      ANCHO_UTIL - PADDING_H * 2 - 8, // un poco más de margen derecho
    );
    const alturaContenido = lineasContenido.length * INTERLINEADO_TEXTO;
    const alturaBloque = PADDING_V + 6 + 4 + alturaContenido + PADDING_V;

    // Verificar si entra en la página actual
    if (y + alturaBloque > 270) {
      doc.addPage();
      y = 18;
    }

    // Fondo del bloque
    doc.setFillColor(...color.bg);
    doc.setDrawColor(...color.borde);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGEN, y, ANCHO_UTIL, alturaBloque, 3, 3, "FD");

    // Barrita de color a la izquierda
    doc.setFillColor(...color.acento);
    doc.rect(MARGEN, y, 3.5, alturaBloque, "F");

    // Título de la sección
    const yTitulo = y + PADDING_V + 1.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...color.titulo);
    const tituloTexto = seccion.tiempo
      ? `${seccion.titulo}   (${seccion.tiempo})`
      : seccion.titulo;
    doc.text(tituloTexto, MARGEN + PADDING_H + 3, yTitulo);

    // Línea divisoria bajo el título
    doc.setDrawColor(...color.borde);
    doc.setLineWidth(0.4);
    doc.line(
      MARGEN + PADDING_H + 3,
      yTitulo + 2.5,
      MARGEN + ANCHO_UTIL - PADDING_H,
      yTitulo + 2.5,
    );

    // Contenido
    const yContenido = yTitulo + 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(45, 38, 30);
    doc.text(lineasContenido, MARGEN + PADDING_H + 3, yContenido);

    y += alturaBloque + GAP_SECCIONES;
  }

  // ── FOOTER ──────────────────────────────────────────────────
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFillColor(254, 248, 240);
    doc.rect(0, 285, W, 12, "F");
    doc.setDrawColor(220, 195, 170);
    doc.setLineWidth(0.4);
    doc.line(0, 285, W, 285);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(160, 120, 90);
    doc.text("Generado por Ohana • Planificación Inteligente", MARGEN, 291.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Página ${i} de ${totalPaginas}`, W - MARGEN, 291.5, {
      align: "right",
    });
  }

  // ── DESCARGA ─────────────────────────────────────────────────
  const nombre = `Ohana_${meta.materia}_${meta.grado || meta.grado}_${meta.fecha}`
    .replace(/\s+/g, "_")
    .replace(/[°/\\:*?"<>|]/g, "");
  doc.save(`${nombre}.pdf`);
}