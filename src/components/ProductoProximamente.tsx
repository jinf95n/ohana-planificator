import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, CheckCircle2, Send } from "lucide-react";

const N8N_BASE = "https://n8n.valy.agency/webhook";

const PROVINCIAS = [
  "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba",
  "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja",
  "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
  "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
  "Tierra del Fuego", "Tucumán"
];

const NIVELES = [
  { value: "inicial", label: "Nivel Inicial" },
  { value: "primaria", label: "Nivel Primario" },
  { value: "secundaria", label: "Nivel Secundario" },
  { value: "superior", label: "Nivel Superior / Terciario" },
];

export interface ProductoConfig {
  id: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  paraQuien: string[];
  features: string[];
}

interface ProductoProximamenteProps {
  config: ProductoConfig;
}

export const ProductoProximamente = ({ config }: ProductoProximamenteProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [provincia, setProvincia] = useState("");
  const [nivel, setNivel] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setEstado("loading");
    try {
      const res = await fetch(`${N8N_BASE}/ohana-waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto: config.id, email, provincia, nivel }),
      });
      const data = await res.json();
      if (data.ok) setEstado("ok");
      else setEstado("error");
    } catch {
      setEstado("error");
    }
  };

  return (
    <div className="min-h-screen bg-cream-soft">

      {/* Navbar mínimo */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cream-soft">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Ohana
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-coral to-amber-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-display text-base text-ink">OHANA</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-warm py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest mb-6">
            Próximamente
          </span>
          <h1 className="font-display text-5xl sm:text-6xl text-cream mb-4 leading-tight">
            {config.nombre}
          </h1>
          <p className="font-serif-elegant text-cream/85 text-xl sm:text-2xl italic">
            {config.tagline}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Descripción */}
        <section className="text-center max-w-2xl mx-auto">
          <p className="text-ink/70 text-lg leading-relaxed font-serif-elegant">
            {config.descripcion}
          </p>
        </section>

        {/* Para quién */}
        <section>
          <h2 className="font-display text-3xl text-ink mb-8 text-center">¿Para quién es?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {config.paraQuien.map((item, i) => (
              <div key={i} className="bg-cream rounded-2xl border border-cream-soft p-5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                <p className="text-ink/75 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="font-display text-3xl text-ink mb-8 text-center">Qué vas a poder hacer</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {config.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-cream rounded-2xl border border-cream-soft p-5">
                <div className="w-6 h-6 rounded-lg bg-coral/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-coral" />
                </div>
                <p className="text-ink/75 text-sm leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist form */}
        <section className="bg-cream rounded-3xl border border-cream-soft p-8 sm:p-10 max-w-xl mx-auto">
          {estado === "ok" ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-ink mb-2">¡Listo, te anotamos!</h3>
              <p className="text-ink/55 text-sm mb-6">
                Te avisamos cuando esté lista. Mientras tanto, probá el Planificador.
              </p>
              <button
                onClick={() => navigate("/planificador")}
                className="flex items-center gap-2 bg-coral text-cream font-semibold px-6 py-2.5 rounded-full mx-auto hover:bg-coral/90 transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Ir al Planificador
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl text-ink mb-2 text-center">Sumate a la lista</h3>
              <p className="text-ink/50 text-sm text-center mb-6">
                Te avisamos el día que esté disponible.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-ink text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-cream-soft border border-cream text-ink placeholder:text-ink/30 rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-ink text-sm font-medium mb-1.5">Provincia</label>
                  <select
                    value={provincia}
                    onChange={e => setProvincia(e.target.value)}
                    className="w-full bg-cream-soft border border-cream text-ink rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all text-sm"
                  >
                    <option value="">Seleccioná tu provincia</option>
                    {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-ink text-sm font-medium mb-1.5">Nivel en el que enseñás</label>
                  <select
                    value={nivel}
                    onChange={e => setNivel(e.target.value)}
                    className="w-full bg-cream-soft border border-cream text-ink rounded-xl px-4 py-3 outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all text-sm"
                  >
                    <option value="">Seleccioná un nivel</option>
                    {NIVELES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </div>

                {estado === "error" && (
                  <p className="text-red-500 text-xs text-center">Algo salió mal. Intentá de nuevo.</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!email || estado === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-coral text-cream font-semibold px-6 py-3 rounded-full hover:bg-coral/90 transition-all shadow-coral disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {estado === "loading" ? (
                    "Enviando..."
                  ) : (
                    <><Send className="w-4 h-4" /> Anotarme</>
                  )}
                </button>
              </div>
            </>
          )}
        </section>

      </div>
    </div>
  );
};