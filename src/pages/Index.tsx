import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { OhanaLogo } from "@/components/OhanaLogo";
import { PlanForm, PlanFormData } from "@/components/PlanForm";
import { PlanificationSkeleton } from "@/components/PlanificationSkeleton";
import { PlanificationResult } from "@/components/PlanificationResult";
import { ProPlans } from "@/components/ProPlans";
import { PartnersBar } from "@/components/PartnersBar";

type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; content: string; meta: PlanFormData };

const Index = () => {
  // ───── Auth (mock) ─────
  // TODO: Replace with real auth (Clerk / Lovable Cloud Google+Apple).
  // The login button should trigger the social OAuth flow here.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName("Docente");
    toast.success("¡Bienvenida a Ohana!", {
      description: "Ya puedes generar tu planificación gratuita del día.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName(undefined);
    setResult({ status: "idle" });
  };

  // ───── Form / generation ─────
  const [result, setResult] = useState<ResultState>({ status: "idle" });

  const handleGenerate = async (data: PlanFormData) => {
    setResult({ status: "loading" });

    try {
      // ─────────────────────────────────────────────────────────────
      // 🔌 BACKEND INTEGRATION POINT
      //
      // Aquí se llama al endpoint del backend. Recomendado:
      //   POST /api/generate-plan  (Next.js API Route o Lovable Cloud Edge Function)
      //
      // Esa ruta debe:
      //   1. Verificar la sesión del usuario (Clerk auth() / Supabase auth.getUser())
      //   2. Consultar la cuota diaria en la base de datos
      //         → SELECT count(*) FROM generations
      //           WHERE user_id = ? AND created_at >= date_trunc('day', now())
      //         → si >= 1 (free tier) devolver 429 con upgrade hint
      //   3. Llamar al webhook de n8n con el payload del formulario:
      //         await fetch(process.env.N8N_WEBHOOK_URL, {
      //           method: "POST",
      //           headers: { Authorization: `Bearer ${process.env.N8N_SECRET}` },
      //           body: JSON.stringify(data),
      //         })
      //   4. Guardar la generación en DB y devolver la respuesta del LLM.
      //
      // const res = await fetch("/api/generate-plan", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // const { content } = await res.json();
      // ─────────────────────────────────────────────────────────────

      // MOCK: simulamos latencia del LLM via n8n
      await new Promise((r) => setTimeout(r, 2400));

      const content = buildMockPlan(data);
      setResult({ status: "ready", content, meta: data });
    } catch (err) {
      console.error(err);
      toast.error("No pudimos generar tu planificación", {
        description: "Inténtalo de nuevo en unos segundos.",
      });
      setResult({ status: "idle" });
    }
  };

  return (
    <main className="min-h-screen">
      {/* ───────── HERO (warm pastel) ───────── */}
      <section className="relative bg-gradient-warm pt-24 pb-32 sm:pb-40 overflow-hidden">
        {/* soft ambient highlights */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cream/30 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-coral/15 blur-[140px] pointer-events-none" />

        <Navbar
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <div className="container relative pt-12">
          <OhanaLogo className="mb-12" />

          <div className="max-w-3xl mx-auto text-center text-cream mb-12 animate-fade-up">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              Ohana Planificación Inteligente
            </h1>
            <p className="font-serif-elegant text-xl sm:text-2xl mt-3 text-cream/95">
              Tu clase del día, personalizada y gratuita.
            </p>
            <h2 className="font-serif-elegant italic text-base sm:text-lg mt-6 text-cream/85 max-w-2xl mx-auto leading-relaxed">
              De la mano de Ohana, apoyada por la mejor tecnología, libera tu tiempo
              y concéntrate en lo que más importa: tus alumnos.
            </h2>
          </div>

          {/* Form / Skeleton / Result swap */}
          <div className="px-2">
            {result.status === "loading" ? (
              <PlanificationSkeleton />
            ) : result.status === "ready" ? (
              <div className="space-y-8">
                <PlanificationResult content={result.content} meta={result.meta} />
                <div className="text-center">
                  <button
                    onClick={() => setResult({ status: "idle" })}
                    className="text-cream/90 hover:text-cream underline underline-offset-4 text-sm font-medium"
                  >
                    ← Generar otra planificación
                  </button>
                </div>
              </div>
            ) : (
              <PlanForm
                isLoggedIn={isLoggedIn}
                onLoginRequired={handleLogin}
                onSubmit={handleGenerate}
              />
            )}
          </div>
        </div>
      </section>

      {/* ───────── PRO PLANS (dark) ───────── */}
      <ProPlans />

      {/* ───────── PARTNERS / FOOTER ───────── */}
      <PartnersBar />
    </main>
  );
};

// ───────── Mock content (will be replaced by n8n LLM response) ─────────
const buildMockPlan = (d: PlanFormData) => `📚 PLANIFICACIÓN DEL DÍA
Materia: ${d.materia} · ${d.grado}
Tema: ${d.tema}

🎯 OBJETIVO DE APRENDIZAJE
${d.objetivo}

⏱ INICIO (10 min)
Activamos saberes previos con una pregunta disparadora vinculada a la vida cotidiana de los estudiantes. Generamos una breve lluvia de ideas y registramos las hipótesis en el pizarrón.

🔬 DESARROLLO (25 min)
Presentamos el contenido central a través de un recurso visual (video corto o infografía). Los estudiantes trabajan en parejas resolviendo una guía con preguntas que profundizan en el tema. Acompañamos recorriendo los grupos.

✨ CIERRE (10 min)
Puesta en común: cada pareja comparte una conclusión. Sintetizamos los aprendizajes clave y conectamos con la próxima clase.

📝 EVALUACIÓN
Observación directa del trabajo en pareja + entrega de la guía completada.

💡 RECURSOS
Pizarrón, proyector, guía impresa, materiales concretos según tema.

— Generado por Ohana Planificación Inteligente`;

export default Index;
