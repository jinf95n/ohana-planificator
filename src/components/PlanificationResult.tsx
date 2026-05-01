import { useState } from "react";
import {
  Sparkles, BookOpen, Target, GraduationCap, Crown, Clock,
  Lightbulb, ChevronRight, FileText, FlaskConical, Package, Star,
  Download, FileEdit, ThumbsUp, ThumbsDown
} from "lucide-react";
import { descargarPlanificacionPDF } from "@/services/pdfGenerator";
import { descargarPlanificacionDOCX } from "@/services/docxGenerator";

const N8N_BASE = "https://n8n.valy.agency/webhook";

interface PlanificationResultProps {
  content: string;
  planId?: string;
  meta: {
    docente: string;
    institucion: string;
    materia: string;
    grado: string;
    tema: string;
    objetivo: string;
    duracion: string;
    fecha: string;
  };
  tipo: "free" | "pro";
}

interface Section {
  key: string;
  title: string;
  content: string;
  tiempo?: string;
}

// ─── Feedback buttons ────────────────────────────────────────────
const FeedbackButtons = ({
  planId, contenido, materia, grado, tema, tipo,
}: {
  planId: string;
  contenido: string;
  materia: string;
  grado: string;
  tema: string;
  tipo: string;
}) => {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [loading, setLoading] = useState(false);

  const enviarFeedback = async (tipo_feedback: "like" | "dislike") => {
    if (feedback || loading) return;
    setLoading(true);
    try {
      await fetch(`${N8N_BASE}/ohana-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, feedback: tipo_feedback, contenido, materia, grado, tema, tipo }),
      });
      setFeedback(tipo_feedback);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  if (feedback) {
    return (
      <div className="flex items-center justify-center gap-2 py-2 text-sm">
        {feedback === "like"
          ? <><ThumbsUp className="w-4 h-4 text-emerald-500" /><span className="text-emerald-500">Gracias por tu valoración</span></>
          : <><ThumbsDown className="w-4 h-4 text-ink/40" /><span className="text-ink/40">Gracias, vamos a mejorar</span></>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="text-ink/40 text-xs">¿Esta planificación te resultó útil?</span>
      <button
        onClick={() => enviarFeedback("like")}
        disabled={loading}
        className="flex items-center gap-1.5 text-ink/40 hover:text-emerald-600 transition-colors text-sm font-medium disabled:opacity-50"
      >
        <ThumbsUp className="w-4 h-4" /> Sí
      </button>
      <button
        onClick={() => enviarFeedback("dislike")}
        disabled={loading}
        className="flex items-center gap-1.5 text-ink/40 hover:text-red-500 transition-colors text-sm font-medium disabled:opacity-50"
      >
        <ThumbsDown className="w-4 h-4" /> No
      </button>
    </div>
  );
};

// ─── Renderer de markdown simple ─────────────────────────────────
function renderMarkdown(texto: string): React.ReactNode {
  const lineas = texto.split("\n");
  return lineas.map((linea, i) => {
    const esLista = /^[-*]\s/.test(linea);
    const esNumerada = /^\d+\.\s/.test(linea);
    const contenido = linea.replace(/^[-*]\s/, "").replace(/^\d+\.\s/, "");

    const partes = contenido.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((parte, j) => {
      if (/^\*\*[^*]+\*\*$/.test(parte))
        return <strong key={j} className="font-semibold text-ink/90">{parte.slice(2, -2)}</strong>;
      if (/^\*[^*]+\*$/.test(parte))
        return <em key={j} className="italic">{parte.slice(1, -1)}</em>;
      return parte;
    });

    if (esLista || esNumerada) {
      return (
        <div key={i} className="flex gap-2 my-0.5">
          <span className="text-ink/40 shrink-0 mt-0.5">
            {esNumerada ? `${linea.match(/^\d+/)?.[0]}.` : "•"}
          </span>
          <span>{partes}</span>
        </div>
      );
    }
    if (!linea.trim()) return <div key={i} className="h-2" />;
    return <div key={i} className="my-0.5">{partes}</div>;
  });
}

// ─── Parser de secciones ─────────────────────────────────────────
function parsearSecciones(texto: string): Section[] {
  const normalizado = texto.replace(/\*\*([A-ZÁÉÍÓÚÑ\s]+)\*\*/g, (_, titulo) => titulo.trim());
  const secciones: Section[] = [];

  const PATRONES = [
    { key: "objetivo",   regex: /OBJETIVO\s*\n([\s\S]*?)(?=\nCONTENIDOS|\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "contenidos", regex: /CONTENIDOS\s*\n([\s\S]*?)(?=\nINICIO|\nSITUACIÓN|\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "inicio",     regex: /(INICIO|SITUACIÓN DISPARADORA)\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nDESARROLLO|\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "desarrollo", regex: /DESARROLLO\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nCIERRE|\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "cierre",     regex: /CIERRE\s*(?:\(([^)]+)\))?\s*\n([\s\S]*?)(?=\nRECURSOS|\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "recursos",   regex: /RECURSOS\s*\n([\s\S]*?)(?=\nEVALUACIÓN|\nTIPS|$)/i },
    { key: "evaluacion", regex: /EVALUACIÓN\s*\n([\s\S]*?)(?=\nTIPS|$)/i },
    { key: "tips",       regex: /TIPS PARA EL DOCENTE\s*\n([\s\S]*?)$/i },
  ];

  for (const patron of PATRONES) {
    const match = normalizado.match(patron.regex);
    if (!match) continue;

    if (patron.key === "inicio") {
      const esDisparadora = match[1]?.toUpperCase().includes("DISPARADORA");
      secciones.push({
        key: "inicio",
        title: esDisparadora ? "Situación disparadora" : "Inicio",
        content: (match[3] || "").trim(),
        tiempo: match[2],
      });
    } else if (patron.key === "desarrollo" || patron.key === "cierre") {
      secciones.push({
        key: patron.key,
        title: patron.key === "desarrollo" ? "Desarrollo" : "Cierre",
        content: (match[2] || "").trim(),
        tiempo: match[1],
      });
    } else {
      const titulos: Record<string, string> = {
        objetivo: "Objetivo", contenidos: "Contenidos",
        recursos: "Recursos", evaluacion: "Evaluación",
        tips: "Tips para el docente",
      };
      secciones.push({ key: patron.key, title: titulos[patron.key], content: (match[1] || "").trim() });
    }
  }

  if (secciones.length === 0) {
    const sinEncabezado = texto
      .replace(/PLANIFICACIÓN DE CLASE.*?\n━+\n/s, "")
      .replace(/DATOS GENERALES[\s\S]*?(?=\nOBJETIVO)/i, "")
      .trim();
    return [{ key: "raw", title: "Planificación", content: sinEncabezado || texto }];
  }

  return secciones;
}

// ─── Config visual por sección ───────────────────────────────────
const SECCION_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  objetivo:   { icon: <Target className="w-4 h-4" />,       color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-100" },
  contenidos: { icon: <FileText className="w-4 h-4" />,     color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-100" },
  inicio:     { icon: <Sparkles className="w-4 h-4" />,     color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100" },
  desarrollo: { icon: <FlaskConical className="w-4 h-4" />, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  cierre:     { icon: <ChevronRight className="w-4 h-4" />, color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-100" },
  recursos:   { icon: <Package className="w-4 h-4" />,      color: "text-slate-700",   bg: "bg-slate-50",   border: "border-slate-100" },
  evaluacion: { icon: <Star className="w-4 h-4" />,         color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-100" },
  tips:       { icon: <Lightbulb className="w-4 h-4" />,    color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  raw:        { icon: <FileText className="w-4 h-4" />,     color: "text-ink/70",      bg: "bg-cream-soft", border: "border-cream" },
};

// ─── Componente principal ────────────────────────────────────────
export const PlanificationResult = ({ content, planId, meta, tipo }: PlanificationResultProps) => {
  const secciones = parsearSecciones(content);
  const [descargandoDocx, setDescargandoDocx] = useState(false);

  const handlePDF = () => descargarPlanificacionPDF(content, meta, tipo);
  const handleDOCX = async () => {
    setDescargandoDocx(true);
    await descargarPlanificacionDOCX(content, meta, tipo);
    setDescargandoDocx(false);
  };

  console.log("[PlanificationResult] planId recibido:", planId);

  return (
    <article className="w-full max-w-2xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="bg-cream rounded-t-3xl px-8 pt-8 pb-6 border border-b-0 border-cream-soft shadow-card-pro">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-coral flex items-center justify-center shrink-0 shadow-coral">
            <Sparkles className="w-5 h-5 text-cream" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="font-display text-2xl text-ink leading-tight">Tu planificación está lista</h3>
              {tipo === "pro" ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-ink/40 bg-ink/5 border border-ink/10 px-2 py-0.5 rounded-full">FREE</span>
              )}
            </div>
            <p className="font-serif-elegant italic text-ink/55 text-sm">
              {meta.docente} · {meta.materia} · {meta.grado}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          <MetaPill icon={<BookOpen className="w-3 h-3" />} label="Materia" value={meta.materia} />
          <MetaPill icon={<GraduationCap className="w-3 h-3" />} label="Grado" value={meta.grado} />
          <MetaPill icon={<Clock className="w-3 h-3" />} label="Duración" value={`${meta.duracion} min`} />
        </div>
      </div>

      {/* Secciones */}
      <div className="bg-cream border border-t-0 border-cream-soft px-6 py-4 space-y-3">
        {secciones.map((seccion) => (
          <SeccionCard key={seccion.key} seccion={seccion} />
        ))}
      </div>

      {/* Footer */}
      <div className="bg-cream rounded-b-3xl border border-t-0 border-cream-soft px-8 py-6 shadow-card-pro space-y-4">

        {/* Feedback */}
        {planId && (
          <div className="border-b border-cream-soft pb-4">
            <FeedbackButtons
              planId={planId}
              contenido={content}
              materia={meta.materia}
              grado={meta.grado}
              tema={meta.tema}
              tipo={tipo}
            />
          </div>
        )}

        {/* Descarga */}
        {tipo === "pro" ? (
          <div className="space-y-3">
            <p className="font-serif-elegant italic text-ink/40 text-xs text-center">
              Descargá en el formato que necesites
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePDF}
                className="flex-1 flex items-center justify-center gap-2 bg-coral text-cream font-semibold px-5 py-2.5 rounded-full shadow-coral hover:shadow-coral-lg hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                <Download className="w-4 h-4" /> Descargar PDF
              </button>
              <button
                onClick={handleDOCX}
                disabled={descargandoDocx}
                className="flex-1 flex items-center justify-center gap-2 bg-cream border border-ink/15 text-ink font-semibold px-5 py-2.5 rounded-full hover:bg-cream-soft hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-50"
              >
                <FileEdit className="w-4 h-4" />
                {descargandoDocx ? "Generando..." : "Editar en Word"}
              </button>
            </div>
            <p className="text-ink/30 text-[10px] text-center">
              El Word es 100% editable · Compatible con Google Docs
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-ink text-sm font-medium">Descargá en PDF y personalizá para tu grupo real</p>
              <p className="text-ink/55 text-xs mt-1">
                Con Ohana Pro podés indicar el contexto de tu clase y recibir una planificación adaptada a tus alumnos reales.
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

// ─── Tarjeta de sección ──────────────────────────────────────────
const SeccionCard = ({ seccion }: { seccion: Section }) => {
  const config = SECCION_CONFIG[seccion.key] || SECCION_CONFIG.raw;
  const esTips = seccion.key === "tips";

  return (
    <div className={`rounded-2xl border p-4 ${config.bg} ${config.border} ${esTips ? "border-dashed border-2" : ""}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`${config.color} p-1.5 rounded-lg bg-white/60 border ${config.border}`}>
          {config.icon}
        </span>
        <div className="flex items-center gap-2">
          <h4 className={`text-sm font-semibold ${config.color}`}>{seccion.title}</h4>
          {seccion.tiempo && (
            <span className={`text-[10px] ${config.color} opacity-70 font-medium bg-white/60 px-2 py-0.5 rounded-full border ${config.border}`}>
              {seccion.tiempo}
            </span>
          )}
        </div>
      </div>
      <div className="text-ink/80 text-sm leading-relaxed">
        {renderMarkdown(seccion.content)}
      </div>
    </div>
  );
};

// ─── Pill de metadato ────────────────────────────────────────────
const MetaPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-brand-soft/40 rounded-xl px-3 py-2 border border-brand/20">
    <div className="flex items-center gap-1 text-ink/50 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
      {icon} {label}
    </div>
    <p className="text-ink text-xs font-medium truncate">{value || "—"}</p>
  </div>
);