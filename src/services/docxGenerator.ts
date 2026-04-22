// Instalar: npm install docx
// El archivo Word generado es 100% editable en Word, Google Docs y LibreOffice

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, HeadingLevel, LevelFormat, UnderlineType,
} from "docx";
import type { PlanMeta } from "./pdfGenerator";

function limpiarMarkdown(texto: string): string {
  return texto.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
}

function parsearLineas(texto: string): string[] {
  return texto.split("\n").map(l => limpiarMarkdown(l));
}

// Color coral Ohana
const CORAL = "D04A2C";
const CORAL_LIGHT = "FDEBD0";
const INK = "1C1917";

// Colores por sección
const SEC_COLORS: Record<string, { bg: string; titulo: string }> = {
  "OBJETIVO":              { bg: "EBF2FF", titulo: "1E50B4" },
  "CONTENIDOS":            { bg: "F0EBFF", titulo: "5A1EB4" },
  "INICIO":                { bg: "FFF8E1", titulo: "966400" },
  "SITUACIÓN DISPARADORA": { bg: "FFF8E1", titulo: "966400" },
  "DESARROLLO":            { bg: "E6FAF0", titulo: "148250" },
  "CIERRE":                { bg: "FFF2E6", titulo: "B45014" },
  "RECURSOS":              { bg: "F0F2F5", titulo: "3C465A" },
  "EVALUACIÓN":            { bg: "FFEBEE", titulo: "B41E3C" },
  "TIPS PARA EL DOCENTE":  { bg: "FFFCDC", titulo: "8C6400" },
};

interface Seccion { titulo: string; contenido: string; tiempo?: string; }

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

function borderNone() {
  const b = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  return { top: b, bottom: b, left: b, right: b };
}

function borderSolid(color: string) {
  const b = { style: BorderStyle.SINGLE, size: 4, color };
  return { top: b, bottom: b, left: b, right: b };
}

export async function descargarPlanificacionDOCX(content: string, meta: PlanMeta, tipo: "free" | "pro") {
  const secciones = parsearSecciones(content);
  const children: (Paragraph | Table)[] = [];

  // ── HEADER institucional ──────────────────────────────────
  children.push(
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [7000, 2360],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: borderNone(),
              shading: { fill: CORAL, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 200, right: 100 },
              width: { size: 7000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "OHANA", bold: true, size: 48, color: "FFF8F0", font: "Arial" }),
                    new TextRun({ text: "  Consultora Educativa · Planificación Inteligente", size: 18, color: "FFDCB4", font: "Arial" }),
                  ]
                }),
              ]
            }),
            new TableCell({
              borders: borderNone(),
              shading: { fill: tipo === "pro" ? "FFC864" : CORAL, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 100, right: 200 },
              width: { size: 2360, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: tipo === "pro" ? "★ PRO" : "FREE",
                      bold: true,
                      size: 20,
                      color: tipo === "pro" ? "6B3500" : "FFF8F0",
                      font: "Arial",
                    }),
                  ]
                }),
              ]
            }),
          ]
        }),
      ]
    })
  );

  // ── TEMA ──────────────────────────────────────────────────
  children.push(new Paragraph({ spacing: { before: 200, after: 80 } }));
  children.push(
    new Paragraph({
      children: [new TextRun({ text: meta.tema, bold: true, size: 28, color: INK, font: "Arial" })],
      spacing: { before: 80, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORAL, space: 4 } },
    })
  );

  // ── DATOS GENERALES ───────────────────────────────────────
  children.push(
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: CORAL_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Docente  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: meta.docente, size: 18, color: INK, font: "Arial" })] })
            ] }),
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: CORAL_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Institución  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: meta.institucion, size: 18, color: INK, font: "Arial" })] })
            ] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: "FFF8F3", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Materia  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: meta.materia, size: 18, color: INK, font: "Arial" })] })
            ] }),
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: "FFF8F3", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Año/Grado  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: meta.grado, size: 18, color: INK, font: "Arial" })] })
            ] }),
        ]}),
        new TableRow({ children: [
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: CORAL_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Fecha  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: meta.fecha, size: 18, color: INK, font: "Arial" })] })
            ] }),
          new TableCell({ borders: borderSolid("E8D5C0"), shading: { fill: CORAL_LIGHT, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 80 }, width: { size: 4680, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: "Duración  ", bold: true, size: 16, color: "885533", font: "Arial" }), new TextRun({ text: `${meta.duracion} minutos`, size: 18, color: INK, font: "Arial" })] })
            ] }),
        ]}),
      ]
    })
  );

  children.push(new Paragraph({ spacing: { before: 200, after: 100 } }));

  // ── SECCIONES ─────────────────────────────────────────────
  for (const seccion of secciones) {
    const colores = SEC_COLORS[seccion.titulo] || SEC_COLORS["RECURSOS"];
    const tituloTexto = seccion.tiempo ? `${seccion.titulo}  (${seccion.tiempo})` : seccion.titulo;
    const lineas = parsearLineas(seccion.contenido).filter(l => l.trim());

    children.push(
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [240, 9120],
        rows: [
          // Fila título
          new TableRow({ children: [
            new TableCell({ borders: borderNone(), shading: { fill: colores.titulo, type: ShadingType.CLEAR }, width: { size: 240, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 60, right: 60 },
              children: [new Paragraph("")] }),
            new TableCell({ borders: { top: borderSolid(colores.bg).top, bottom: { style: BorderStyle.SINGLE, size: 2, color: colores.titulo }, left: borderNone().left, right: borderSolid(colores.bg).right },
              shading: { fill: colores.bg, type: ShadingType.CLEAR }, width: { size: 9120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 160, right: 120 },
              children: [
                new Paragraph({ children: [new TextRun({ text: tituloTexto, bold: true, size: 18, color: colores.titulo, font: "Arial" })] })
              ] }),
          ]}),
          // Fila contenido
          new TableRow({ children: [
            new TableCell({ borders: borderNone(), shading: { fill: colores.titulo, type: ShadingType.CLEAR }, width: { size: 240, type: WidthType.DXA }, margins: { top: 40, bottom: 80, left: 60, right: 60 },
              children: [new Paragraph("")] }),
            new TableCell({ borders: { top: borderNone().top, bottom: borderSolid(colores.bg).bottom, left: borderNone().left, right: borderSolid(colores.bg).right },
              shading: { fill: colores.bg, type: ShadingType.CLEAR }, width: { size: 9120, type: WidthType.DXA }, margins: { top: 60, bottom: 100, left: 160, right: 120 },
              children: lineas.map(linea => {
                const esLista = /^[\-\*]\s/.test(linea) || /^\d+\.\s/.test(linea);
                const textoLimpio = linea.replace(/^[\-\*]\s/, "").replace(/^\d+\.\s/, "");
                return new Paragraph({
                  children: [
                    ...(esLista ? [new TextRun({ text: "• ", size: 18, color: INK, font: "Arial" })] : []),
                    new TextRun({ text: textoLimpio, size: 18, color: INK, font: "Arial" }),
                  ],
                  indent: esLista ? { left: 200 } : undefined,
                  spacing: { after: 60 },
                });
              }),
            }),
          ]}),
        ]
      })
    );

    children.push(new Paragraph({ spacing: { before: 120, after: 0 } }));
  }

  // ── DOCUMENTO ─────────────────────────────────────────────
  const document = new Document({
    numbering: { config: [] },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 720, right: 1008, bottom: 720, left: 1008 },
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: "", size: 1 })],
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 4, color: "E8D5C0", space: 6 } },
              children: [
                new TextRun({ text: "Generado por Ohana Planificación Inteligente  ·  ", size: 14, color: "A07850", font: "Arial" }),
                new TextRun({ text: "Página ", size: 14, color: "A07850", font: "Arial" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: "A07850", font: "Arial" }),
                new TextRun({ text: " de ", size: 14, color: "A07850", font: "Arial" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, color: "A07850", font: "Arial" }),
              ]
            })
          ]
        })
      },
      children,
    }]
  });

  // ── DESCARGA ──────────────────────────────────────────────
  const buffer = await Packer.toBlob(document);
  const url = URL.createObjectURL(buffer);
  const a = window.document.createElement("a");
  a.href = url;
  const nombre = `Ohana_${meta.materia}_${meta.grado}_${meta.fecha}`
    .replace(/\s+/g, "_").replace(/[°\/\\:*?"<>|]/g, "");
  a.download = `${nombre}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}