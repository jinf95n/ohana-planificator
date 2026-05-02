import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Crown,
  Zap,
  BookOpen,
  FileDown,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

// ─── Config ───────────────────────────────────────────────────────
const PLANES = {
  esencial: {
    nombre: "Docente Esencial",
    descripcion: "Para quien planifica todos los días",
    mensual: 6500,
    anual: 55000,
    anualMensualizado: Math.round(55000 / 10),
    color: "from-blue-600/20 to-blue-800/10",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    cta: "bg-blue-600 hover:bg-blue-500",
    icon: <BookOpen className="w-5 h-5" />,
    limite: "5 planificaciones por día",
    features: [
      "5 planificaciones por día",
      "Modelo con razonamiento profundo",
      "Contexto de tu grupo real",
      "Tips exclusivos para el docente",
      "Descarga en PDF y Word",
      "Historial completo",
      "Soporte por email",
    ],
  },
  completo: {
    nombre: "Docente Completo",
    descripcion: "Para quien planifica en equipo o varias materias",
    mensual: 11000,
    anual: 92000,
    anualMensualizado: Math.round(92000 / 10),
    color: "from-amber-600/20 to-amber-900/10",
    border: "border-amber-500/40",
    accent: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    cta: "bg-amber-500 hover:bg-amber-400 text-amber-950",
    icon: <Crown className="w-5 h-5" />,
    limite: "10 planificaciones por día",
    destacado: true,
    features: [
      "10 planificaciones por día",
      "Modelo con razonamiento profundo",
      "Contexto de tu grupo real",
      "Tips exclusivos para el docente",
      "Descarga en PDF y Word",
      "Historial completo",
      "Soporte prioritario",
      "Acceso anticipado a nuevas funciones",
    ],
  },
};

const FREE_FEATURES = [
  "1 planificación por día",
  "Estructura completa (inicio, desarrollo, cierre)",
  "Objetivo y contenidos didácticos",
  "Recursos y evaluación sugeridos",
];

const FAQS = [
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, podés cancelar en cualquier momento. Si cancelás, mantenés el acceso hasta el final del período pagado.",
  },
  {
    q: "¿Cómo funciona el plan anual?",
    a: "El plan anual está calculado en base a 10 meses de clases (el año lectivo real). Pagás por adelantado y ahorrás aproximadamente un 30% respecto al mensual.",
  },
  {
    q: "¿Qué pasa en las vacaciones?",
    a: "El plan anual ya tiene en cuenta los meses sin clases — por eso el precio está pensado en 10 meses. En el mensual podés pausar o cancelar cuando quieras.",
  },
  {
    q: "¿Los pagos son seguros?",
    a: "Sí, procesamos los pagos a través de MercadoPago, la plataforma de pagos más confiable de Argentina.",
  },
  {
    q: "¿Puedo cambiar de plan?",
    a: "Sí, podés subir o bajar de plan en cualquier momento desde tu panel de cuenta.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────
export const Precios = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [facturacion, setFacturacion] = useState<"mensual" | "anual">(
    "mensual",
  );
  const [faqAbierta, setFaqAbierta] = useState<number | null>(null);
  const { openSignIn } = useClerk();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const precio = (plan: typeof PLANES.esencial) =>
    facturacion === "mensual" ? plan.mensual : plan.anualMensualizado;

  const formatARS = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="relative bg-gradient-warm">
        <Navbar onLogin={() => openSignIn()} />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-coral/10 border border-coral/20 text-coral text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Primeras 5 planificaciones Pro son gratis
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-cream mb-4">
            Elegí tu plan
          </h1>
          <p className="text-cream/60 text-lg max-w-xl mx-auto">
            Dos cafés por mes y nunca más llegás a casa sin tener la clase
            lista.
          </p>

          {/* Toggle mensual/anual */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setFacturacion("mensual")}
              className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                facturacion === "mensual"
                  ? "bg-cream text-ink"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setFacturacion("anual")}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                facturacion === "anual"
                  ? "bg-cream text-ink"
                  : "text-cream/50 hover:text-cream"
              }`}
            >
              Anual
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                −30%
              </span>
            </button>
          </div>
          {facturacion === "anual" && (
            <p className="text-cream/40 text-xs mt-2">
              Calculado en 10 meses lectivos · Se cobra por adelantado
            </p>
          )}
        </div>

        {/* ── Cards de planes ─────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {/* Free */}
          <div className="bg-ink-soft border border-ink-border rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cream/50" />
                </div>
                <span className="text-cream/50 text-xs font-semibold uppercase tracking-widest">
                  Gratis
                </span>
              </div>
              <div className="mb-1">
                <span className="font-display text-4xl text-cream">$0</span>
              </div>
              <p className="text-cream/40 text-sm">
                Para empezar a conocer Ohana
              </p>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-cream/60"
                >
                  <CheckCircle2 className="w-4 h-4 text-cream/30 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/")}
              className="w-full border border-ink-border text-cream/60 hover:text-cream hover:border-cream/30 font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              {isSignedIn ? "Seguir con Free" : "Empezar gratis"}
            </button>
          </div>

          {/* Esencial */}
          <PlanCard
            plan={PLANES.esencial}
            facturacion={facturacion}
            precio={precio(PLANES.esencial)}
            formatARS={formatARS}
          />

          {/* Completo */}
          <PlanCard
            plan={PLANES.completo}
            facturacion={facturacion}
            precio={precio(PLANES.completo)}
            formatARS={formatARS}
          />
        </div>

        {/* ── Social proof ─────────────────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              icon: <Users className="w-4 h-4" />,
              valor: "400+",
              label: "docentes activos",
            },
            {
              icon: <Star className="w-4 h-4" />,
              valor: "4.9",
              label: "valoración promedio",
            },
            {
              icon: <Clock className="w-4 h-4" />,
              valor: "30 seg",
              label: "por planificación",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-ink-soft border border-ink-border rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <div className="text-coral/60">{s.icon}</div>
              <div>
                <p className="font-display text-xl text-cream">{s.valor}</p>
                <p className="text-cream/40 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-cream text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-ink-soft border border-ink-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-cream text-sm font-medium">
                    {faq.q}
                  </span>
                  <span
                    className={`text-cream/40 text-lg transition-transform ${faqAbierta === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {faqAbierta === i && (
                  <div className="px-5 pb-4 text-cream/55 text-sm leading-relaxed border-t border-ink-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer CTA ───────────────────────────────────────── */}
        <div className="text-center mt-16 py-12 border-t border-ink-border">
          <p className="text-cream/40 text-sm mb-2">
            ¿Todavía no probaste Ohana?
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-coral text-cream font-semibold px-8 py-3 rounded-full hover:bg-coral/90 transition-all shadow-coral"
          >
            <Sparkles className="w-4 h-4" />
            Empezar gratis — 5 planificaciones Pro de regalo
          </button>
        </div>
      </main>
    </div>
  );
};

// ─── Plan card ────────────────────────────────────────────────────
const PlanCard = ({
  plan,
  facturacion,
  precio,
  formatARS,
}: {
  plan: typeof PLANES.esencial;
  facturacion: "mensual" | "anual";
  precio: number;
  formatARS: (n: number) => string;
}) => (
  <div
    className={`relative bg-gradient-to-b ${plan.color} border ${plan.border} rounded-2xl p-6 flex flex-col ${"destacado" in plan && plan.destacado ? "ring-1 ring-amber-500/30" : ""}`}
  >
    {"destacado" in plan && plan.destacado && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
          MÁS POPULAR
        </span>
      </div>
    )}

    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.badge}`}
        >
          {plan.icon}
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${plan.accent}`}
        >
          {plan.nombre}
        </span>
      </div>

      <div className="flex items-end gap-1 mb-1">
        <span className="font-display text-4xl text-cream">
          {formatARS(precio)}
        </span>
        <span className="text-cream/40 text-sm mb-1.5">/mes</span>
      </div>

      {facturacion === "anual" && (
        <p className="text-cream/40 text-xs">
          {formatARS(("anual" in plan ? plan.anual : 0) as number)} por año ·
          ahorrás {formatARS(plan.mensual * 12 - (plan.anual as number))}
        </p>
      )}
      <p className="text-cream/50 text-sm mt-2">{plan.descripcion}</p>
    </div>

    <ul className="space-y-3 flex-1 mb-6">
      {plan.features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-cream/75">
          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.accent}`} />
          {f}
        </li>
      ))}
    </ul>

    <button
      className={`w-full font-bold py-3 rounded-xl transition-all text-sm ${plan.cta} ${"destacado" in plan && plan.destacado ? "text-amber-950" : "text-cream"}`}
    >
      Próximamente
    </button>

    <p className="text-center text-cream/25 text-xs mt-3">
      Pagás con MercadoPago
    </p>
  </div>
);
