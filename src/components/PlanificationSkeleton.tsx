import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

const TIPS = [
  "Un cierre de 5 minutos bien diseñado vale más que 20 minutos de desarrollo sin síntesis.",
  "Las actividades con movimiento mejoran la concentración, especialmente en nivel primario.",
  "Empezar con una pregunta que genere conflicto cognitivo activa la curiosidad desde el minuto uno.",
  "Los alumnos recuerdan mejor lo que construyen que lo que escuchan. Priorizá la producción.",
  "Un objetivo bien escrito dice qué va a poder hacer el alumno, no qué va a enseñar el docente.",
  "El error es parte del aprendizaje. Diseñá actividades donde equivocarse tenga sentido.",
  "Variar el agrupamiento (individual, parejas, grupos) en una misma clase mantiene el ritmo.",
  "Los 10 primeros minutos son los más valiosos. Usá el disparador para captar la atención.",
  "Una rúbrica clara antes de la actividad reduce la ansiedad y mejora la calidad del trabajo.",
  "Adaptar el contexto de la clase a la realidad del barrio hace que el contenido tenga sentido.",
  "La evaluación formativa durante la clase vale más que un solo examen al final.",
  "Dar tiempo para la reflexión individual antes del debate grupal mejora la participación.",
  "Los recursos simples bien usados superan a la tecnología mal planificada.",
  "Nombrar lo que aprendieron al final de la clase consolida la memoria a largo plazo.",
  "Una consigna clara y breve es más efectiva que tres párrafos de instrucciones.",
];

export const PlanificationSkeleton = () => {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTipIndex(i => (i + 1) % TIPS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-ink rounded-3xl p-8 sm:p-10 shadow-card-pro border border-ink-border animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded-full skeleton-shimmer" />
          <div className="h-2.5 w-1/3 rounded-full skeleton-shimmer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-3 rounded-full skeleton-shimmer w-full" />
        <div className="h-3 rounded-full skeleton-shimmer w-11/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-4/5" />

        <div className="h-px bg-ink-border my-6" />

        <div className="h-3 rounded-full skeleton-shimmer w-1/2" />
        <div className="h-3 rounded-full skeleton-shimmer w-full" />
        <div className="h-3 rounded-full skeleton-shimmer w-10/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-9/12" />

        <div className="h-px bg-ink-border my-6" />

        <div className="h-3 rounded-full skeleton-shimmer w-2/5" />
        <div className="h-3 rounded-full skeleton-shimmer w-11/12" />
        <div className="h-3 rounded-full skeleton-shimmer w-7/12" />
      </div>

      {/* Tip rotativo */}
      <div className="mt-8 border-t border-ink-border/50 pt-6">
        <div
          className={`transition-all duration-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
        >
          <div className="flex items-start gap-3 bg-cream/5 border border-cream/10 rounded-2xl px-4 py-3.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
                Tip de planificación
              </p>
              <p className="text-cream/70 text-sm leading-relaxed font-serif-elegant italic">
                {TIPS[tipIndex]}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-cream/40 text-xs font-serif-elegant italic">
          Ohana está preparando tu clase…
        </p>
      </div>
    </div>
  );
};