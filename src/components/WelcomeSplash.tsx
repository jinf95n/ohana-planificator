import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const FRASES = [
  "Enseñar es sembrar en terreno que no siempre se puede ver.",
  "Cada clase es una oportunidad de cambiar una historia.",
  "El aula más poderosa es la que hace preguntas, no la que da respuestas.",
  "Un docente recuerda siempre al maestro que lo inspiró. Vos sos ese maestro para alguien.",
  "La paciencia no es esperar — es saber que el aprendizaje tiene su propio tiempo.",
  "Planificar es un acto de amor hacia tus alumnos.",
  "No se trata de cubrir el programa. Se trata de descubrir el mundo juntos.",
  "El mejor recurso didáctico siempre fuiste vos.",
  "Enseñar cansa, pero lo que construís dura décadas.",
  "Una buena pregunta en el momento justo vale más que diez respuestas.",
  "El aula es el lugar donde el futuro se practica.",
  "Educar es creer en alguien antes de que esa persona crea en sí misma.",
  "No hay currículo que reemplace la presencia de un docente que escucha.",
  "Lo que hoy parece rutina, mañana puede ser el recuerdo que lo cambió todo.",
  "Cada alumno difícil es un alumno que todavía no encontró su forma de aprender.",
  "La energía que traés al aula es el primer contenido de la clase.",
  "Enseñar en Argentina es un acto de resistencia y esperanza al mismo tiempo.",
  "El aprendizaje más profundo ocurre cuando el alumno no se da cuenta que está aprendiendo.",
  "Una clase bien planificada es una clase donde el docente puede estar presente de verdad.",
  "Lo que no se evalúa con nota, a veces es lo más importante que dejás.",
];

const HOY = new Date().toISOString().slice(0, 10);
const STORAGE_KEY = "ohana_splash_fecha";

function fraseDeDia(): string {
  const inicio = new Date("2026-01-01").getTime();
  const hoy = new Date().setHours(0, 0, 0, 0);
  const dias = Math.floor((hoy - inicio) / 86400000);
  return FRASES[dias % FRASES.length];
}

export function yaVioHoy(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === HOY;
  } catch {
    return false;
  }
}

function marcarComoVisto(): void {
  try {
    localStorage.setItem(STORAGE_KEY, HOY);
  } catch {}
}

interface WelcomeSplashProps {
  nombre: string;
  onDone: () => void;
}

export const WelcomeSplash = ({ nombre, onDone }: WelcomeSplashProps) => {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSaliendo(true);
      setTimeout(() => {
        marcarComoVisto();
        onDone();
      }, 700);
    }, 3800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-700 ease-out ${
        saliendo ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Fondo difuminado */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(36 95% 65% / 0.92) 0%, hsl(230 18% 8% / 0.88) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      {/* Destellos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-coral/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-400/10 blur-[100px] pointer-events-none" />

      {/* Contenido */}
      <div
        className={`relative z-10 max-w-lg mx-auto px-8 text-center transition-all duration-700 ease-out ${
          saliendo ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Ícono */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-coral flex items-center justify-center mx-auto mb-8 shadow-coral animate-float-slow">
          <Sparkles className="w-7 h-7 text-cream" />
        </div>

        {/* Saludo */}
        <p className="text-cream/60 text-xs font-semibold uppercase tracking-[0.3em] mb-4">
          Bienvenida de vuelta, {nombre}
        </p>

        {/* Frase */}
        <blockquote className="font-serif-elegant text-cream text-2xl sm:text-3xl leading-snug italic">
          "{fraseDeDia()}"
        </blockquote>

        {/* Dots animados */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {[0, 0.25, 0.5].map((delay, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cream/40 animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        <p className="text-cream/30 text-xs mt-3 font-serif-elegant italic">
          Preparando tu espacio…
        </p>
      </div>
    </div>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────
export function useSplash(isLoaded: boolean, isSignedIn: boolean | undefined) {
  const [mostrarSplash, setMostrarSplash] = useState(() => {
    return !yaVioHoy();
  });

  useEffect(() => {
    if (isLoaded && isSignedIn !== true) {
      setMostrarSplash(false);
    }
    if (isLoaded && isSignedIn === true && yaVioHoy()) {
      setMostrarSplash(false);
    }
  }, [isLoaded, isSignedIn]);

  return { mostrarSplash, ocultarSplash: () => setMostrarSplash(false) };
}
