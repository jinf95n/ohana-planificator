import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";

export interface PlanFormData {
  materia: string;
  grado: string;
  tema: string;
  objetivo: string;
}

interface PlanFormProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onSubmit: (data: PlanFormData) => void;
}

export const PlanForm = ({ isLoggedIn, onLoginRequired, onSubmit }: PlanFormProps) => {
  const [data, setData] = useState<PlanFormData>({
    materia: "",
    grado: "",
    tema: "",
    objetivo: "",
  });

  const isValid = Object.values(data).every((v) => v.trim().length > 0);
  const canSubmit = isLoggedIn && isValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return onLoginRequired();
    if (!isValid) return;
    onSubmit(data);
  };

  const update = (k: keyof PlanFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-ink rounded-3xl p-6 sm:p-10 shadow-card-pro border border-ink-border animate-fade-up"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field id="materia" label="Materia" placeholder="Ej. Ciencias Naturales" value={data.materia} onChange={update("materia")} />
        <Field id="grado" label="Año / Grado" placeholder="Ej. 4° grado" value={data.grado} onChange={update("grado")} />
        <Field id="tema" label="Tema de la clase" placeholder="Ej. El ciclo del agua" value={data.tema} onChange={update("tema")} className="sm:col-span-2" />
        <Field id="objetivo" label="Objetivo" placeholder="Ej. Que comprendan las fases del ciclo" value={data.objetivo} onChange={update("objetivo")} className="sm:col-span-2" />
      </div>

      <Button
        type="submit"
        disabled={!canSubmit}
        size="lg"
        className="mt-8 w-full bg-gradient-coral hover:opacity-95 text-cream font-semibold rounded-full h-14 text-base shadow-coral hover:shadow-[0_25px_60px_-15px_hsl(var(--coral)/0.7)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {!isLoggedIn ? (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Inicia sesión para generar tu planificación
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generar Planificación del Día (¡Es Gratis!)
          </>
        )}
      </Button>

      {isLoggedIn && (
        <p className="text-center text-cream/50 text-xs mt-4">
          1 planificación gratuita por día · Powered by Ohana IA
        </p>
      )}
    </form>
  );
};

const Field = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  className = "",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => (
  <div className={className}>
    <label htmlFor={id} className="block text-cream text-sm font-medium mb-2">
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-ink-soft border border-ink-border text-cream placeholder:text-cream/30 rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-all duration-200"
    />
  </div>
);
