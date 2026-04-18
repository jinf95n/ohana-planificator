import { Sparkles, BookOpen, Target, GraduationCap } from "lucide-react";

interface PlanificationResultProps {
  content: string;
  meta: {
    materia: string;
    grado: string;
    tema: string;
    objetivo: string;
  };
}

export const PlanificationResult = ({ content, meta }: PlanificationResultProps) => {
  return (
    <article className="w-full max-w-2xl mx-auto bg-cream rounded-3xl p-8 sm:p-10 shadow-card-pro border border-cream-soft animate-fade-up">
      <header className="flex items-start gap-3 pb-6 mb-6 border-b border-ink/10">
        <div className="w-11 h-11 rounded-full bg-gradient-coral flex items-center justify-center shrink-0 shadow-coral">
          <Sparkles className="w-5 h-5 text-cream" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-2xl text-ink leading-tight">
            Tu planificación está lista
          </h3>
          <p className="font-serif-elegant italic text-ink/60 text-sm mt-0.5">
            Generada con cariño por Ohana
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MetaPill icon={<BookOpen className="w-3.5 h-3.5" />} label="Materia" value={meta.materia} />
        <MetaPill icon={<GraduationCap className="w-3.5 h-3.5" />} label="Grado" value={meta.grado} />
        <MetaPill icon={<Sparkles className="w-3.5 h-3.5" />} label="Tema" value={meta.tema} />
        <MetaPill icon={<Target className="w-3.5 h-3.5" />} label="Objetivo" value={meta.objetivo} />
      </div>

      <div className="prose prose-sm max-w-none text-ink/85 whitespace-pre-wrap leading-relaxed font-[Inter]">
        {content}
      </div>
    </article>
  );
};

const MetaPill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-brand-soft/40 rounded-2xl px-3 py-2 border border-brand/30">
    <div className="flex items-center gap-1 text-ink/60 text-[10px] uppercase tracking-wider font-semibold">
      {icon}
      {label}
    </div>
    <p className="text-ink text-sm font-medium truncate mt-0.5">{value || "—"}</p>
  </div>
);
