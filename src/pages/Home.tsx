import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  Sparkles, ArrowRight, CheckCircle2, Clock, Lock,
  FileText, ClipboardCheck, Drama, FolderKanban, Presentation, BookOpen
} from "lucide-react";

const PRODUCTOS = [
  {
    id: "planificador",
    nombre: "Planificador de clases",
    tagline: "Tu clase de mañana, lista esta noche.",
    descripcion: "Generá planificaciones completas en segundos, adaptadas a tu materia, grado y contexto real del aula.",
    icon: BookOpen,
    disponible: true,
    href: "/planificador",
    cta: "Probar gratis",
  },
  {
    id: "rubricas",
    nombre: "Rúbricas y evaluaciones",
    tagline: "Evaluá con criterios claros y justos.",
    descripcion: "Generá rúbricas, criterios de evaluación y exámenes adaptados a tu planificación.",
    icon: ClipboardCheck,
    disponible: false,
    href: "/producto/rubricas",
    cta: "Sumarme a la lista",
  },
  {
    id: "devoluciones",
    nombre: "Devoluciones a alumnos",
    tagline: "Retroalimentación que realmente ayuda.",
    descripcion: "Redactá devoluciones personalizadas y constructivas para cada alumno en segundos.",
    icon: FileText,
    disponible: false,
    href: "/producto/devoluciones",
    cta: "Sumarme a la lista",
  },
  {
    id: "actos-escolares",
    nombre: "Actos escolares",
    tagline: "Actos que emocionan y tienen sentido pedagógico.",
    descripcion: "Guiones, cronogramas y discursos para actos patrios y eventos institucionales.",
    icon: Drama,
    disponible: false,
    href: "/producto/actos-escolares",
    cta: "Sumarme a la lista",
  },
  {
    id: "presentaciones",
    nombre: "Presentaciones para el aula",
    tagline: "Diapositivas listas para proyectar.",
    descripcion: "Generá presentaciones visuales adaptadas a tu clase, materia y nivel educativo.",
    icon: Presentation,
    disponible: false,
    href: "/producto/presentaciones",
    cta: "Sumarme a la lista",
  },
  {
    id: "aci",
    nombre: "Adaptaciones curriculares (ACI)",
    tagline: "Cada alumno merece una clase a su medida.",
    descripcion: "Generá adaptaciones curriculares individuales respetando el marco normativo argentino.",
    icon: FolderKanban,
    disponible: false,
    href: "/producto/aci",
    cta: "Sumarme a la lista",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="bg-cream-soft">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-warm overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cream/25 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-coral/12 blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cream/20 border border-cream/30 text-cream text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Consultora Educativa — San Juan, Argentina
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream leading-[1.05] mb-6">
              Educación que entiende el aula argentina
            </h1>

            <p className="font-serif-elegant text-cream/85 text-xl sm:text-2xl leading-relaxed mb-10 max-w-2xl">
              Combinamos experiencia docente real con tecnología hecha para el día a día del aula.
              Empezamos resolviendo el dolor más grande: planificar.
            </p>

            <button
              onClick={() => isSignedIn ? navigate("/planificador") : openSignIn()}
              className="group flex items-center gap-3 bg-coral text-cream font-semibold px-8 py-4 rounded-full shadow-coral hover:shadow-coral-lg hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              <Sparkles className="w-5 h-5" />
              Probar el Planificador gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-cream/50 text-sm mt-4">
              Sin tarjeta · 5 planificaciones Pro de regalo al registrarte
            </p>
          </div>
        </div>
      </section>

      {/* ── Propuesta de valor ───────────────────────────────── */}
      <section className="py-20 bg-ink">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Clock className="w-6 h-6 mx-auto mb-4 text-coral" />, titulo: "30 segundos", desc: "Es lo que tarda Ohana en generar una planificación completa" },
              { icon: <CheckCircle2 className="w-6 h-6 mx-auto mb-4 text-emerald-400" />, titulo: "Alineada al aula real", desc: "Adaptada a tu materia, grado y contexto específico del grupo" },
              { icon: <Sparkles className="w-6 h-6 mx-auto mb-4 text-amber-400" />, titulo: "Hecha por docentes", desc: "Creada por quien sabe lo que pasa cuando suena el timbre" },
            ].map((item, i) => (
              <div key={i} className="text-cream/80">
                {item.icon}
                <h3 className="font-display text-2xl text-cream mb-2">{item.titulo}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos ────────────────────────────────────────── */}
      <section id="productos" className="py-24 bg-cream-soft">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-ink/40 text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Ecosistema de herramientas
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-ink text-center mb-4">
            Nuestros productos
          </h2>
          <p className="text-center text-ink/55 font-serif-elegant text-lg max-w-xl mx-auto mb-16">
            Cada herramienta resuelve un problema real del docente argentino.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTOS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(p.href)}
                  className={`group relative bg-cream rounded-2xl border p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    p.disponible
                      ? "border-coral/20 hover:border-coral/40 hover:shadow-coral"
                      : "border-cream-soft hover:border-ink/10 opacity-75 hover:opacity-90"
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      p.disponible ? "bg-coral/10" : "bg-ink/5"
                    }`}>
                      <Icon className={`w-5 h-5 ${p.disponible ? "text-coral" : "text-ink/30"}`} />
                    </div>
                    {p.disponible ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Disponible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5" /> Próximamente
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl text-ink mb-1">{p.nombre}</h3>
                  <p className="font-serif-elegant italic text-ink/50 text-sm mb-3">{p.tagline}</p>
                  <p className="text-ink/65 text-sm leading-relaxed mb-5">{p.descripcion}</p>

                  <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                    p.disponible
                      ? "text-coral group-hover:text-coral/80"
                      : "text-ink/40 group-hover:text-ink/60"
                  }`}>
                    {p.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-warm">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-cream mb-4">
            Empezá hoy, gratis
          </h2>
          <p className="font-serif-elegant text-cream/80 text-xl mb-8">
            5 planificaciones Pro de regalo al registrarte. Sin tarjeta, sin compromiso.
          </p>
          <button
            onClick={() => isSignedIn ? navigate("/planificador") : openSignIn()}
            className="group inline-flex items-center gap-3 bg-coral text-cream font-semibold px-8 py-4 rounded-full shadow-coral hover:shadow-coral-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5" />
            {isSignedIn ? "Ir al Planificador" : "Crear cuenta gratis"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
};