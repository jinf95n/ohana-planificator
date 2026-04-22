import { Sparkles, BookOpen, Target, GraduationCap, Crown, Clock, Lightbulb, ChevronRight, FileText, FlaskConical, Package, Star } from "lucide-react";

interface PlanificationResultProps {
  content: string;
  meta: {
    docente: string;
    materia: string;
    grado: string;
    tema: string;
    objetivo: string;
    duracion: string;
  };
  tipo: "free" | "pro";
}

// ─── Parser de secciones ────────────────────────────────────────
interface Section {
  key: string;
  title: string;
  content: string;
  tiempo?: string;
}

function parsearSecciones(texto: string): Section[] {
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
    const match = texto.match(patron.regex);
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
        objetivo:   "Objetivo",
        contenidos: "Contenidos",
        recursos:   "Recursos",
        evaluacion: "Evaluación",
        tips:       "Tips para el docente",
      };
      secciones.push({
        key: patron.key,
        title: titulos[patron.key],
        content: (match[1] || "").trim(),
      });
    }
  }

  // Fallback — si el parser no encontró secciones mostramos el texto completo
  if (secciones.length === 0) {
    // Intentamos limpiar el encabezado de datos generales
    const sinEncabezado = texto
      .replace(/PLANIFICACIÓN DE CLASE.*?\n━+\n/s, "")
      .replace(/DATOS GENERALES[\s\S]*?(?=\nOBJETIVO)/i, "")
      .trim();
    return [{ key: "raw", title: "Planificación", content: sinEncabezado || texto }];
  }

  return secciones;
}

// ─── Config visual por sección ──────────────────────────────────
const SECCION_CONFIG: Record<string, {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}> = {
  objetivo:   { icon: <Target className="w-4 h-4" />,      color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-100" },
  contenidos: { icon: <FileText className="w-4 h-4" />,    color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-100" },
  inicio:     { icon: <Sparkles className="w-4 h-4" />,    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-100" },
  desarrollo: { icon: <FlaskConical className="w-4 h-4" />, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
  cierre:     { icon: <ChevronRight className="w-4 h-4" />, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100" },
  recursos:   { icon: <Package className="w-4 h-4" />,     color: "text-slate-700",  bg: "bg-slate-50",  border: "border-slate-100" },
  evaluacion: { icon: <Star className="w-4 h-4" />,        color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-100" },
  tips:       { icon: <Lightbulb className="w-4 h-4" />,   color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  raw:        { icon: <FileText className="w-4 h-4" />,     color: "text-ink/70",     bg: "bg-cream-soft", border: "border-cream" },
};

// ─── Componente principal ───────────────────────────────────────
export const PlanificationResult = ({ content, meta, tipo }: PlanificationResultProps) => {
  const secciones = parsearSecciones(content);

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
              <h3 className="font-display text-2xl text-ink leading-tight">
                Tu planificación está lista
              </h3>
              {tipo === "pro" ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                  <Crown className="w-2.5 h-2.5" /> PRO
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-ink/40 bg-ink/5 border border-ink/10 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              )}
            </div>
            <p className="font-serif-elegant italic text-ink/55 text-sm">
              {meta.docente} · {meta.materia} · {meta.grado}
            </p>
          </div>
        </div>

        {/* Meta pills */}
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
      <div className="bg-cream rounded-b-3xl border border-t-0 border-cream-soft px-8 py-6 shadow-card-pro">
        {tipo === "free" ? (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-ink text-sm font-medium">
                Descargá en PDF y personalizá para tu grupo real
              </p>
              <p className="text-ink/55 text-xs mt-1">
                Con Ohana Pro podés indicar el contexto de tu clase y recibir una planificación adaptada a tus alumnos reales.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center font-serif-elegant italic text-ink/40 text-sm">
            Generado por Ohana · Versión Pro
          </p>
        )}
      </div>

    </article>
  );
};

// ─── Tarjeta de sección ─────────────────────────────────────────
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
          <h4 className={`text-sm font-semibold ${config.color}`}>
            {seccion.title}
          </h4>
          {seccion.tiempo && (
            <span className={`text-[10px] ${config.color} opacity-70 font-medium bg-white/60 px-2 py-0.5 rounded-full border ${config.border}`}>
              {seccion.tiempo}
            </span>
          )}
        </div>
      </div>
      <div className="text-ink/80 text-sm leading-relaxed whitespace-pre-wrap">
        {seccion.content}
      </div>
    </div>
  );
};

// ─── Pill de metadato ───────────────────────────────────────────
const MetaPill = ({
  icon, label, value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-brand-soft/40 rounded-xl px-3 py-2 border border-brand/20">
    <div className="flex items-center gap-1 text-ink/50 text-[10px] uppercase tracking-wider font-semibold mb-0.5">
      {icon} {label}
    </div>
    <p className="text-ink text-xs font-medium truncate">{value || "—"}</p>
  </div>
);