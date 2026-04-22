import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Crown } from "lucide-react";
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
  docente: string;
  institucion: string;
  grado: string;
  materia: string;
  fecha: string;
  duracion: string;
  tema: string;
  objetivo: string;
  contexto: string;
}

interface PlanFormProps {
  isLoggedIn: boolean;
  isPro: boolean;
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
      "1° Grado", "2° Grado", "3° Grado",
      "4° Grado", "5° Grado", "6° Grado", "7° Grado",
    ],
  },
  {
    label: "Nivel Secundario",
    options: [
      "1° Año Secundaria", "2° Año Secundaria", "3° Año Secundaria",
      "4° Año Secundaria", "5° Año Secundaria", "6° Año Secundaria",
    ],
  },
];

const DURACIONES = ["40", "60", "80", "90", "120"];

export const PlanForm = ({ isLoggedIn, isPro, onLoginRequired, onSubmit }: PlanFormProps) => {
  const hoy = new Date().toISOString().split("T")[0];

  const [data, setData] = useState<PlanFormData>({
    docente: "",
    institucion: "",
    grado: "",
    materia: "",
    fecha: hoy,
    duracion: "",
    tema: "",
    objetivo: "",
    contexto: "",
  });

  const camposBase: (keyof PlanFormData)[] = [
    "docente", "institucion", "grado", "materia",
    "fecha", "duracion", "tema", "objetivo",
  ];

  const isValid = camposBase.every((k) => data[k].trim().length > 0);
  const canSubmit = isLoggedIn && isValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return onLoginRequired();
    if (!isValid) return;
    onSubmit(data);
  };

  const update =
    (k: keyof PlanFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((d) => ({ ...d, [k]: e.target.value }));

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-ink rounded-3xl p-6 sm:p-10 shadow-card-pro border border-ink-border animate-fade-up"
    >
      {/* Badge PRO / FREE */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-cream/60 text-xs tracking-widest uppercase font-semibold">
          Completá los datos de tu clase
        </p>
        {isPro ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-300/10 border border-amber-300/20 px-3 py-1 rounded-full">
            <Crown className="w-3 h-3" /> Pro
          </span>
        ) : (
          <span className="text-xs text-cream/40 bg-cream/5 border border-cream/10 px-3 py-1 rounded-full">
            Plan Gratuito · 1 por día
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Docente */}
        <Field
          id="docente"
          label="Nombre del docente"
          placeholder="Ej. María González"
          value={data.docente}
          onChange={update("docente")}
        />

        {/* Institución */}
        <Field
          id="institucion"
          label="Institución"
          placeholder="Ej. Escuela Nro. 123"
          value={data.institucion}
          onChange={update("institucion")}
        />

        {/* Grado */}
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
              <SelectValue placeholder="Seleccioná el nivel" />
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

        {/* Materia */}
        <Field
          id="materia"
          label="Materia / Asignatura"
          placeholder="Ej. Ciencias Naturales"
          value={data.materia}
          onChange={update("materia")}
        />

        {/* Fecha */}
        <div>
          <label htmlFor="fecha" className="block text-cream text-sm font-medium mb-2">
            Fecha de la clase
          </label>
          <input
            id="fecha"
            type="date"
            value={data.fecha}
            onChange={update("fecha")}
            className="w-full bg-ink-soft border border-ink-border text-cream rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-all duration-200"
          />
        </div>

        {/* Duración */}
        <div>
          <label htmlFor="duracion" className="block text-cream text-sm font-medium mb-2">
            Duración de la clase
          </label>
          <Select
            value={data.duracion}
            onValueChange={(v) => setData((d) => ({ ...d, duracion: v }))}
          >
            <SelectTrigger
              id="duracion"
              className="w-full bg-ink-soft border border-ink-border text-cream rounded-xl px-4 h-12 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-all duration-200 data-[placeholder]:text-cream/30"
            >
              <SelectValue placeholder="¿Cuánto dura la clase?" />
            </SelectTrigger>
            <SelectContent className="bg-ink border-ink-border text-cream">
              {DURACIONES.map((d) => (
                <SelectItem
                  key={d}
                  value={d}
                  className="text-cream focus:bg-coral/15 focus:text-cream cursor-pointer"
                >
                  {d} minutos
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tema */}
        <Field
          id="tema"
          label="Tema de la clase"
          placeholder="Ej. La fotosíntesis"
          value={data.tema}
          onChange={update("tema")}
          className="sm:col-span-2"
        />

        {/* Objetivo */}
        <div className="sm:col-span-2">
          <label htmlFor="objetivo" className="block text-cream text-sm font-medium mb-2">
            Objetivo
          </label>
          <textarea
            id="objetivo"
            value={data.objetivo}
            onChange={update("objetivo")}
            placeholder="Ej. Que los alumnos comprendan cómo las plantas producen su propio alimento"
            rows={2}
            className="w-full bg-ink-soft border border-ink-border text-cream placeholder:text-cream/30 rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-all duration-200 resize-none"
          />
        </div>

        {/* Contexto — Solo PRO */}
        {isPro ? (
          <div className="sm:col-span-2">
            <label htmlFor="contexto" className="block text-sm font-medium mb-2 flex items-center gap-2">
              <span className="text-cream">Contame tu clase</span>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-300/10 border border-amber-300/20 px-2 py-0.5 rounded-full">
                PRO
              </span>
            </label>
            <textarea
              id="contexto"
              value={data.contexto}
              onChange={update("contexto")}
              placeholder={`Contame lo que necesite saber para personalizar la planificación.\n\nEj: "Tengo 2 alumnos en silla de ruedas", "el grupo es muy inquieto", "prefiero actividades sin exposición oral", "quiero algo lúdico sin libros"`}
              rows={4}
              className="w-full bg-ink-soft border border-amber-300/30 text-cream placeholder:text-cream/30 rounded-xl px-4 py-3 outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/20 transition-all duration-200 resize-none"
            />
            <p className="mt-2 text-cream/40 text-xs">
              Cuanto más detallado, mejor se adapta la planificación a tu grupo real.
            </p>
          </div>
        ) : (
          /* Upsell del campo contexto para usuarios FREE */
          <div className="sm:col-span-2">
            <div className="flex items-start gap-3 bg-amber-300/5 border border-amber-300/20 rounded-xl px-4 py-3">
              <Crown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-cream/80 text-sm font-medium">
                  Personalizá para tu grupo real{" "}
                  <span className="text-amber-300">— disponible en Pro</span>
                </p>
                <p className="text-cream/45 text-xs mt-1">
                  Contale a Ohana si tenés alumnos con necesidades especiales, un grupo poco participativo, o cómo preferís trabajar la clase.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón */}
      <Button
        type="submit"
        disabled={!canSubmit}
        size="lg"
        className="mt-8 w-full bg-gradient-coral hover:opacity-95 text-cream font-semibold rounded-full h-14 text-base shadow-coral hover:shadow-[0_25px_60px_-15px_hsl(var(--coral)/0.7)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {!isLoggedIn ? (
          <>
            <Lock className="w-4 h-4 mr-2" />
            Iniciá sesión para generar tu planificación
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {isPro ? "Generar Planificación Pro" : "Generar Planificación Gratuita"}
          </>
        )}
      </Button>

      {isLoggedIn && !isPro && (
        <p className="text-center text-cream/50 text-xs mt-4">
          1 planificación gratuita por día · Powered by Ohana IA
        </p>
      )}
    </form>
  );
};

// ─── Campo de texto reutilizable ───────────────────────────────
const Field = ({
  id, label, placeholder, value, onChange, className = "",
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