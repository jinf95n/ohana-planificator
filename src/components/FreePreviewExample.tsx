import { ArrowDown } from "lucide-react";

/**
 * Mockup de "Así se ve tu planificación gratuita (Texto Plano)".
 * Estética deliberadamente básica/genérica para contrastar con la versión Pro.
 */
export const FreePreviewExample = () => {
  const scrollToPro = () => {
    document.getElementById("pro-plans")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full max-w-2xl mx-auto mt-16 animate-fade-up">
      <div className="text-center mb-5">
        <p className="text-cream/85 text-sm font-medium tracking-wide">
          Así se ve tu planificación gratuita{" "}
          <span className="text-cream/55 italic font-serif-elegant">(Texto Plano)</span>
        </p>
      </div>

      {/* Tarjeta deliberadamente básica: borde dashed, fondo neutro, mono font */}
      <div className="bg-cream/95 border-2 border-dashed border-ink/25 rounded-md p-6 sm:p-8 shadow-sm">
        <pre className="font-mono text-[12.5px] sm:text-[13px] leading-relaxed text-ink/80 whitespace-pre-wrap break-words">
{`PLANIFICACIÓN DIARIA
--------------------
Materia: Biología
Grado:   2° Año Secundaria
Tema:    Fotosíntesis

Objetivo:
  Que los estudiantes comprendan el
  proceso de la fotosíntesis.

Actividades:
  1. Introducción al tema (10 min)
  2. Lectura guiada del capítulo (15 min)
  3. Diagrama del proceso en grupos (20 min)
  4. Puesta en común y cierre (10 min)

Evaluación:
  Observación del trabajo grupal.

--------------------
Generado por Ohana IA`}
        </pre>
      </div>

      {/* Upsell sutil */}
      <button
        type="button"
        onClick={scrollToPro}
        className="mt-4 w-full group flex items-center justify-center gap-2 text-cream/70 hover:text-cream text-sm transition-colors"
      >
        <span className="italic font-serif-elegant">
          (Para exportaciones en PDF con formato oficial y logos, ver{" "}
          <span className="text-coral-glow font-semibold not-italic">Ohana Pro</span>)
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-coral-glow group-hover:translate-y-0.5 transition-transform" />
      </button>
    </section>
  );
};
