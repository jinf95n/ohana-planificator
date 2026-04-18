import { Button } from "@/components/ui/button";
import { CalendarRange, ClipboardCheck, FileText, ArrowRight } from "lucide-react";

const plans = [
  {
    icon: CalendarRange,
    title: "Planificación de la Unidad Completa",
    desc: "De una clase a una unidad didáctica integral. Secuencia, contenidos y actividades alineadas a tu currículum.",
    badge: "Plan Anual",
  },
  {
    icon: ClipboardCheck,
    title: "Generador de Evaluaciones y Rúbricas",
    desc: "Rúbricas automáticas, criterios de evaluación y exámenes listos para imprimir en segundos.",
    badge: "Rúbricas IA",
  },
  {
    icon: FileText,
    title: "Exportación a PDF con Formato Oficial",
    desc: "Documentos institucionales con tu logo, encabezados y firmas listos para presentar a dirección.",
    badge: "Soporte oficial",
  },
];

export const ProPlans = () => {
  return (
    <section className="bg-gradient-pro text-cream py-24 sm:py-32 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-coral/10 blur-[150px] pointer-events-none" />

      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase bg-cream/10 border border-cream/15 text-cream/80 px-4 py-1.5 rounded-full">
            Ohana Pro
          </span>
          <h2 className="font-display text-5xl sm:text-6xl mt-6 leading-tight">
            Lleva tu aula al <span className="text-gradient-coral">siguiente nivel</span>
          </h2>
          <p className="font-serif-elegant italic text-cream/70 text-lg mt-4">
            Herramientas pensadas por docentes, potenciadas por la mejor IA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative bg-gradient-card-pro border border-ink-border rounded-3xl p-8 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* hover gradient border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, hsl(var(--coral)/0.15), transparent 60%)" }} />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-pro-accent flex items-center justify-center shadow-coral mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-cream" strokeWidth={1.5} />
                  </div>

                  <span className="text-[10px] tracking-[0.2em] uppercase text-coral-glow font-semibold">
                    {p.badge}
                  </span>
                  <h3 className="font-display text-2xl mt-2 leading-tight">{p.title}</h3>
                  <p className="text-cream/65 text-sm mt-3 leading-relaxed min-h-[72px]">
                    {p.desc}
                  </p>

                  <Button
                    variant="ghost"
                    className="mt-6 px-0 hover:bg-transparent text-coral-glow hover:text-cream group/btn font-semibold"
                  >
                    Explorar Pro
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
