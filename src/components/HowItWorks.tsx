import { ClipboardList, Sparkles, Download } from "lucide-react";

const PASOS = [
  {
    numero: "01",
    icon: <ClipboardList className="w-6 h-6" />,
    titulo: "Completás los datos",
    desc: "Materia, grado, tema y objetivo. Menos de 2 minutos. Sin tecnicismos.",
  },
  {
    numero: "02",
    icon: <Sparkles className="w-6 h-6" />,
    titulo: "Ohana genera la planificación",
    desc: "Nuestra IA crea una planificación completa con inicio, desarrollo y cierre adaptados a tu clase.",
  },
  {
    numero: "03",
    icon: <Download className="w-6 h-6" />,
    titulo: "Usás o descargás",
    desc: "Copiás el resultado o lo descargás en PDF con formato institucional listo para dirección.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-8 sm:py-20">
      <div className="container">
        <p className="text-center text-cream/60 text-xs tracking-[0.3em] uppercase font-semibold mb-10">
          Cómo funciona
        </p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {PASOS.map((paso, i) => (
            <div
              key={paso.numero}
              className="relative flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Línea conectora */}
              {i < PASOS.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+2.5rem)] right-0 h-px border-t border-dashed border-cream/25" />
              )}

              {/* Ícono */}
              <div className="w-16 h-16 rounded-2xl bg-cream/15 border border-cream/20 flex items-center justify-center text-cream mb-4 backdrop-blur-sm relative z-10">
                {paso.icon}
              </div>

              {/* Número */}
              <span className="text-[10px] tracking-[0.25em] text-cream/40 font-semibold mb-2">
                {paso.numero}
              </span>

              <h3 className="font-display text-xl text-cream mb-2">
                {paso.titulo}
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed font-serif-elegant">
                {paso.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};