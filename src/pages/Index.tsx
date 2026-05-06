import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useUser, useClerk, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  Sparkles,
  Crown,
  CheckCircle2,
  Users,
  Star,
  Clock3,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { OhanaLogo } from "@/components/OhanaLogo";
import { PlanForm, PlanFormData } from "@/components/PlanForm";
import { PlanificationSkeleton } from "@/components/PlanificationSkeleton";
import { PlanificationResult } from "@/components/PlanificationResult";
import { PartnersBar } from "@/components/PartnersBar";
import { HowItWorks } from "@/components/HowItWorks";
import { generarPlanificacion } from "@/services/generation";
import { WelcomeSplash, useSplash } from "@/components/WelcomeSplash";

type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "ready";
      content: string;
      meta: PlanFormData;
      tipo: "free" | "pro";
      planId: string | null;
    };

interface CreditState {
  creditosRestantes: number | null;
  creditosBienvenida: number | null;
  plan: string;
}

const STATS = [
  { icon: <Users className="w-4 h-4" />, value: "400+", label: "docentes" },
  { icon: <Star className="w-4 h-4" />, value: "4.9", label: "valoración" },
  { icon: <Clock3 className="w-4 h-4" />, value: "30 seg", label: "promedio" },
];

const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  const { mostrarSplash, ocultarSplash } = useSplash(isLoaded, isSignedIn);

  const isPro =
    (user?.publicMetadata?.plan as string) === "pro" ||
    (user?.publicMetadata?.plan as string) === "starter";

  const userName =
    user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0];

  const handleLoginRequired = () => {
    openSignIn({
      afterSignInUrl: window.location.href,
      afterSignUpUrl: window.location.href,
    });
  };

  const [devPro, setDevPro] = useState(false);
  const [result, setResult] = useState<ResultState>({ status: "idle" });
  const [credits, setCredits] = useState<CreditState | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const tieneBienvenida =
    (credits?.creditosBienvenida ?? 0) > 0 && credits?.plan === "free";
  const planEfectivo = import.meta.env.DEV
    ? devPro || tieneBienvenida
    : isPro || tieneBienvenida;

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    fetch("https://n8n.valy.agency/webhook/ohana-usuario-perfil", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        const p = Array.isArray(data) ? data[0] : data;
        if (!p) return;
        setCredits({
          creditosRestantes: p.creditosRestantesHoy ?? null,
          creditosBienvenida: p.creditosBienvenida ?? null,
          plan: p.plan ?? "free",
        });
      })
      .catch(() => {})
      .finally(() => setLoadingCredits(false));
  }, [isSignedIn, user?.id]);

  const handleGenerate = async (data: PlanFormData) => {
    if (!isSignedIn) {
      handleLoginRequired();
      return;
    }
    setResult({ status: "loading" });

    try {
      const plan = await generarPlanificacion(
        {
          docente: data.docente || userName || "Docente",
          institucion: data.institucion,
          grado: data.grado,
          materia: data.materia,
          fecha: data.fecha,
          duracion: data.duracion,
          tema: data.tema,
          objetivo: data.objetivo,
          contexto: data.contexto,
        },
        planEfectivo,
        user?.id,
      );
      setCredits({
        creditosRestantes: plan.creditosRestantes,
        creditosBienvenida: plan.creditosBienvenida,
        plan: plan.plan,
      });
      setResult({
        status: "ready",
        content: plan.content,
        meta: data,
        tipo: plan.tipo,
        planId: plan.planId,
      });
      console.log("[Ohana] result completo:", plan);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      if (mensaje.includes("cuota") || mensaje.includes("limite")) {
        toast.error("Usaste tu planificación gratuita de hoy", {
          description:
            "Volvé mañana o sumate a Ohana Pro para generar sin límites.",
          duration: 6000,
        });
      } else {
        toast.error("No pudimos generar tu planificación", {
          description: mensaje,
        });
      }
      setResult({ status: "idle" });
    }
  };

  const esResultado = result.status === "ready" || result.status === "loading";

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-warm overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cream/25 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-coral/12 blur-[140px] pointer-events-none" />

        <Navbar onLogin={() => openSignIn()} />

        <div className="container relative pt-10 pb-20 sm:pb-28">

          <div className="max-w-3xl mx-auto text-center text-cream mb-10 animate-fade-up">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              Tu clase de mañana,
              <br />
              lista esta noche.
            </h1>
            <p className="font-serif-elegant text-lg sm:text-xl mt-5 text-cream/85 max-w-2xl mx-auto leading-relaxed">
              Llegás a casa cansada. Mañana tenés que presentar la
              planificación.
              <br className="hidden sm:block" />
              <span className="text-cream font-medium">
                {" "}
                Ohana la genera en segundos — gratis, sin vueltas.
              </span>
            </p>
          </div>

          {!esResultado && (
            <>
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                {isSignedIn ? (
                  <button
                    onClick={scrollToForm}
                    className="group flex items-center gap-2 bg-coral text-cream font-semibold px-8 py-3.5 rounded-full shadow-coral hover:shadow-coral-lg hover:-translate-y-0.5 transition-all duration-200 text-base"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generar planificación
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                ) : (
                  <SignInButton
                    mode="modal"
                    afterSignInUrl={window.location.href}
                    afterSignUpUrl={window.location.href}
                  >
                    <button className="group flex items-center gap-2 bg-coral text-cream font-semibold px-8 py-3.5 rounded-full shadow-coral hover:shadow-coral-lg hover:-translate-y-0.5 transition-all duration-200 text-base">
                      <Sparkles className="w-4 h-4" />
                      Generar planificación gratis
                      <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </SignInButton>
                )}
                <span className="text-cream/50 text-sm">
                  {isSignedIn
                    ? `Hola, ${userName} 👋`
                    : "1 clic con Google · Sin tarjeta"}
                </span>
              </div>

              <div
                className="flex items-center justify-center gap-6 sm:gap-10 mb-14 animate-fade-up"
                style={{ animationDelay: "0.18s" }}
              >
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center text-cream"
                  >
                    <div className="flex items-center gap-1.5 text-cream/60 mb-0.5">
                      {s.icon}
                      <span className="text-[11px] uppercase tracking-widest font-semibold">
                        {s.label}
                      </span>
                    </div>
                    <span className="font-display text-2xl leading-none">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {import.meta.env.DEV && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setDevPro((p) => !p)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all ${devPro ? "bg-amber-300/20 border-amber-300/40 text-amber-300" : "bg-cream/10 border-cream/20 text-cream/60"}`}
              >
                {devPro ? "✦ Modo PRO activo" : "Modo FREE activo"} — clic para
                cambiar
              </button>
            </div>
          )}

          <div ref={formRef} className="px-2 scroll-mt-8">
            {isSignedIn && credits && result.status !== "loading" && (
              <CreditosChip
                credits={credits}
                onVerPlanes={() => navigate("/precios")}
              />
            )}

            {result.status === "loading" ? (
              <PlanificationSkeleton />
            ) : mostrarSplash && isSignedIn ? (
              <WelcomeSplash
                nombre={userName ?? "docente"}
                onDone={ocultarSplash}
              />
            ) : loadingCredits && isSignedIn ? (
              <PlanificationSkeleton />
            ) : result.status === "ready" ? (
              <div className="space-y-8">
                <PlanificationResult
                  content={result.content}
                  planId={result.planId}
                  meta={result.meta}
                  tipo={result.tipo}
                />
                <div className="text-center">
                  <button
                    onClick={() => setResult({ status: "idle" })}
                    className="text-cream/80 hover:text-cream underline underline-offset-4 text-sm font-medium transition-colors"
                  >
                    ← Generar otra planificación
                  </button>
                </div>
              </div>
            ) : (
              <PlanForm
                isLoggedIn={isSignedIn ?? false}
                isPro={planEfectivo}
                esBienvenida={tieneBienvenida}
                creditosBienvenida={credits?.creditosBienvenida ?? 0}
                onLoginRequired={handleLoginRequired}
                onSubmit={handleGenerate}
              />
            )}
          </div>
        </div>
      </section>

      {!esResultado && (
        <section className="bg-gradient-ink">
          <HowItWorks />
        </section>
      )}

      {!esResultado && (
        <ComparativaFreePro
          onScrollToForm={scrollToForm}
          onVerPlanes={() => navigate("/precios")}
        />
      )}

      <PartnersBar />
    </main>
  );
};

// ─── Chip contador de créditos ────────────────────────────────────
const CreditosChip = ({
  credits,
  onVerPlanes,
}: {
  credits: CreditState;
  onVerPlanes: () => void;
}) => {
  const { creditosRestantes, creditosBienvenida, plan } = credits;

  if (
    creditosBienvenida !== null &&
    creditosBienvenida > 0 &&
    plan === "free"
  ) {
    return (
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-2.5 bg-amber-500 text-amber-950 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg">
          <Zap className="w-4 h-4" />
          🎁 Tenés {creditosBienvenida} planificaciones Pro gratuitas para
          probar
        </div>
      </div>
    );
  }

  if (
    creditosBienvenida !== null &&
    creditosBienvenida === 0 &&
    plan === "free"
  ) {
    return (
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-3 bg-ink-soft border border-amber-500/30 rounded-2xl px-5 py-3.5 max-w-md w-full">
          <div className="flex-1">
            <p className="text-amber-300 font-semibold text-sm">
              Agotaste tus 5 planificaciones Pro
            </p>
            <p className="text-cream/50 text-xs mt-0.5">
              Seguís con 1 gratis por día, o pasate a Pro para hasta 10.
            </p>
          </div>
          <button
            onClick={onVerPlanes}
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap"
          >
            Ver planes
          </button>
        </div>
      </div>
    );
  }

  if (creditosRestantes !== null && (plan === "pro" || plan === "starter")) {
    const limite = plan === "pro" ? 10 : 5;
    return (
      <div className="flex justify-center mb-5">
        <div
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border ${
            creditosRestantes === 0
              ? "bg-red-500/15 border-red-500/30 text-red-300"
              : "bg-cream/10 border-cream/20 text-cream/60"
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          {creditosRestantes === 0
            ? "Llegaste al límite de hoy — volvé mañana"
            : `Te quedan ${creditosRestantes} de ${limite} planificaciones de hoy`}
        </div>
      </div>
    );
  }

  return null;
};

// ─── Tabla FREE vs PRO ────────────────────────────────────────────
const FILAS = [
  { label: "1 planificación por día", free: true, pro: false },
  { label: "Hasta 10 planificaciones por día", free: false, pro: true },
  {
    label: "Planificación completa (inicio, desarrollo, cierre)",
    free: true,
    pro: true,
  },
  { label: "Objetivo y contenidos didácticos", free: true, pro: true },
  { label: "Recursos sugeridos y evaluación", free: true, pro: true },
  { label: "Contexto de tu grupo real", free: false, pro: true },
  { label: "Tips exclusivos para el docente", free: false, pro: true },
  { label: "Descarga en PDF y Word", free: false, pro: true },
  { label: "Historial de planificaciones", free: false, pro: true },
];

const ComparativaFreePro = ({
  onScrollToForm,
  onVerPlanes,
}: {
  onScrollToForm: () => void;
  onVerPlanes: () => void;
}) => (
  <section className="py-20 bg-cream-soft">
    <div className="container">
      <p className="text-center text-ink/40 text-xs tracking-[0.3em] uppercase font-semibold mb-3">
        ¿Cuál es para mí?
      </p>
      <h2 className="font-display text-3xl sm:text-4xl text-ink text-center mb-12">
        Gratis o Pro — las dos funcionan
      </h2>

      <div className="max-w-2xl mx-auto overflow-x-auto">
        <div className="min-w-[480px] bg-cream rounded-3xl border border-cream-soft shadow-card-pro overflow-hidden">
          <div className="max-w-2xl mx-auto bg-cream rounded-3xl border border-cream-soft shadow-card-pro overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_200px] gap-4 px-6 py-4 bg-brand/10 border-b border-cream-soft">
              <span />
              <span className="text-center text-ink/50 text-xs font-semibold uppercase tracking-widest">
                Free
              </span>
              <span className="text-center text-amber-700 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" /> Esencial / Completo
              </span>
            </div>

            {FILAS.map((fila, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_80px_200px] gap-4 px-6 py-3.5 items-center ${i < FILAS.length - 1 ? "border-b border-cream-soft/60" : ""}`}
              >
                <span className="text-ink/75 text-sm font-serif-elegant">
                  {fila.label}
                </span>
                <span className="flex justify-center">
                  {fila.free ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="w-4 h-px bg-ink/15 mx-auto block mt-2" />
                  )}
                </span>
                <span className="flex justify-center">
                  {fila.pro ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  ) : (
                    <span className="w-4 h-px bg-ink/15 mx-auto block mt-2" />
                  )}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-[1fr_80px_200px] gap-4 px-6 py-5 bg-brand/5 border-t border-cream-soft">
              <span />
              <div className="flex justify-center">
                <button
                  onClick={onScrollToForm}
                  className="text-xs text-ink/60 hover:text-ink underline underline-offset-2 transition-colors whitespace-nowrap"
                >
                  Empezar gratis
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={onVerPlanes}
                  className="text-xs text-amber-700 font-semibold bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap transition-colors"
                >
                  Ver planes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Index;
