import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const GRADO_GROUPS: { label: string; options: string[] }[] = [
  {
    label: "Nivel Inicial",
    options: ["Sala de 3", "Sala de 4", "Sala de 5"],
  },
  {
    label: "Nivel Primario",
    options: [
      "1° Grado",
      "2° Grado",
      "3° Grado",
      "4° Grado",
      "5° Grado",
      "6° Grado",
      "7° Grado",
    ],
  },
  {
    label: "Nivel Secundario",
    options: [
      "1° Año Secundaria",
      "2° Año Secundaria",
      "3° Año Secundaria",
      "4° Año Secundaria",
      "5° Año Secundaria",
      "6° Año Secundaria",
    ],
  },
];

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
        <Field
          id="materia"
          label="Materia"
          placeholder="Ej. Ciencias Naturales"
          value={data.materia}
          onChange={update("materia")}
        />

        {/* Grado: dropdown estructurado */}
        <div>
          <label htmlFor="grado" className="block text-cream text-sm font-medium mb-2">
            Año / Grado
          </label>
          <Select
            value={data.grado}
            onValueChange={(v) => setData((d) => ({ ...d, grado: v }))}
          >
            <SelectTrigger
              id="grado"
              className="w-full bg-ink-soft border border-ink-border text-cream rounded-xl px-4 h-12 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-all duration-200 data-[placeholder]:text-cream/30"
            >
              <SelectValue placeholder="Selecciona el nivel" />
            </SelectTrigger>
            <SelectContent className="bg-ink border-ink-border text-cream max-h-72">
              {GRADO_GROUPS.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className="text-cream/50 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    {group.label}
                  </SelectLabel>
                  {group.options.map((opt) => (
                    <SelectItem
                      key={opt}
                      value={opt}
                      className="text-cream focus:bg-coral/15 focus:text-cream cursor-pointer"
                    >
                      {opt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Field
          id="tema"
          label="Tema de la clase"
          placeholder="Ej. El ciclo del agua"
          value={data.tema}
          onChange={update("tema")}
          className="sm:col-span-2"
        />

        <Field
          id="objetivo"
          label="Objetivo"
          placeholder="Ej. Que comprendan las fases del ciclo"
          value={data.objetivo}
          onChange={update("objetivo")}
          hint="(e.g., Que comprendan las fases de la fotosíntesis)"
          className="sm:col-span-2"
        />
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
  hint,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  hint?: string;
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
    {hint && (
      <p className="mt-2 text-cream/40 text-xs italic font-serif-elegant">{hint}</p>
    )}
  </div>
);
