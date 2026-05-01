import { useNavigate } from "react-router-dom";
import { CalendarRange, ClipboardCheck, FileText, Drama, FolderKanban, Presentation, Lock } from "lucide-react";

const HERRAMIENTAS_PRO = [
  {
    icon: CalendarRange,
    title: "Planificación de Unidad Completa",
    desc: "De una clase a una unidad didáctica integral. Secuencia, contenidos y actividades alineadas a tu currículum.",
    badge: "Plan Anual",
    disponible: false,
  },
  {
    icon: ClipboardCheck,
    title: "Generador de Evaluaciones y Rúbricas",
    desc: "Rúbricas automáticas, criterios de evaluación y exámenes listos para imprimir en segundos.",
    badge: "Rúbricas IA",
    disponible: false,
  },
  {
    icon: FileText,
    title: "Exportación con Formato Oficial",
    desc: "Documentos institucionales con tu logo, encabezados y firmas listos para presentar a dirección.",
    badge: "PDF & Word",
    disponible: false,
  },
  {
    icon: Drama,
    title: "Generador de Actos Escolares",
    desc: "Guiones, cronogramas y discursos para actos patrios y eventos institucionales en segundos.",
    badge: "Próximamente",
    disponible: false,
  },
  {
    icon: FolderKanban,
    title: "Proyectos Interdisciplinarios",
    desc: "Diseñá proyectos que integren varias materias con objetivos, etapas y criterios de evaluación.",
    badge: "Próximamente",
    disponible: false,
  },
  {
    icon: Presentation,
    title: "Presentaciones para el Aula",
    desc: "Generá presentaciones visuales listas para proyectar, adaptadas a tu clase y nivel educativo.",
    badge: "Próximamente",
    disponible: false,
  },
];

export const ProPlans = () => {
  const navigate = useNavigate();

  return (
    <section id="pro-plans" className="bg-gradient-pro text-cream py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-coral/10 blur-[150px] pointer-events-none" />

      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase bg-cream/10 border border-cream/15 text-cream/80 px-4 py-1.5 rounded-full">
            Ohana Pro
          </span>
          <h2 className="font-display text-5xl sm:text-6xl mt-6 leading-tight">
            Llevá tu aula al <span className="text-gradient-coral">siguiente nivel</span>
          </h2>
          <p className="font-serif-elegant text-cream/90 text-xl sm:text-2xl mt-5 leading-relaxed">
            Herramientas pensadas por docentes,{" "}
            <span className="italic text-cream">potenciadas por la mejor IA.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {HERRAMIENTAS_PRO.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`group relative bg-gradient-card-pro border rounded-3xl p-8 transition-all duration-500 overflow-hidden ${
                  p.disponible
                    ? "border-ink-border hover:-translate-y-1.5 cursor-pointer"
                    : "border-ink-border/50 opacity-70"
                }`}
              >
                {/* hover glow — solo disponibles */}
                {p.disponible && (
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, hsl(var(--coral)/0.15), transparent 60%)" }}
                  />
                )}

                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-coral mb-6 transition-transform duration-500 ${
                    p.disponible
                      ? "bg-gradient-pro-accent group-hover:scale-110"
                      : "bg-ink-border/50"
                  }`}>
                    {p.disponible
                      ? <Icon className="w-6 h-6 text-cream" strokeWidth={1.5} />
                      : <Lock className="w-5 h-5 text-cream/30" strokeWidth={1.5} />
                    }
                  </div>

                  <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${
                    p.disponible ? "text-coral-glow" : "text-cream/30"
                  }`}>
                    {p.badge}
                  </span>
                  <h3 className="font-display text-2xl mt-2 leading-tight">{p.title}</h3>
                  <p className="text-cream/65 text-sm mt-3 leading-relaxed min-h-[72px]">{p.desc}</p>

                  {p.disponible ? (
                    <button
                      onClick={() => navigate("/precios")}
                      className="mt-6 flex items-center gap-1.5 text-coral-glow hover:text-cream font-semibold text-sm transition-colors group/btn"
                    >
                      Ver en Pro
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                    </button>
                  ) : (
                    <span className="mt-6 inline-flex items-center gap-1.5 text-cream/25 text-sm font-semibold">
                      <Lock className="w-3 h-3" /> En desarrollo
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};