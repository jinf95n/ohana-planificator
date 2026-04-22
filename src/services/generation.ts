// ─────────────────────────────────────────────────────────────
// Ohana — Servicio de Generación de Planificaciones
//
// El frontend solo manda los datos al webhook de n8n.
// Todo lo demás vive en n8n:
//   - Construcción del prompt FREE o PRO
//   - Llamada a Groq (o DeepSeek cuando corresponda)
//   - Control de cuota diaria
//   - Lógica de negocio
//
// Para configurar: agregá VITE_N8N_WEBHOOK_URL en tu .env
// ─────────────────────────────────────────────────────────────

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

export interface PlanInput {
  docente: string;
  institucion: string;
  grado: string;
  materia: string;
  fecha: string;
  duracion: string;
  tema: string;
  objetivo: string;
  contexto?: string; // Solo PRO — n8n decide cómo usarlo
}

export type Plan = {
  content: string;
  tipo: "free" | "pro";
};

// ─── Llamada al webhook de n8n ─────────────────────────────────
export async function generarPlanificacion(
  data: PlanInput,
  isPro: boolean
): Promise<Plan> {
  if (!WEBHOOK_URL) {
    throw new Error(
      "Webhook no configurado. Agregá VITE_N8N_WEBHOOK_URL en tu .env"
    );
  }

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Datos del formulario
      ...data,
      // Tipo de plan — n8n usa esto para elegir prompt y modelo
      tipo: isPro ? "pro" : "free",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.message || `Error del servidor (${response.status}). Intentá de nuevo.`
    );
  }

 const result = await response.json();

// n8n devuelve array — tomamos el primer elemento
const n8nData = Array.isArray(result) ? result[0] : result;

if (!n8nData?.content) {
  throw new Error("No se recibió la planificación. Intentá de nuevo.");
}

// Limpiamos el "=" que agrega n8n en algunos casos
const content = n8nData.content.startsWith("=")
  ? n8nData.content.slice(1)
  : n8nData.content;

return {
  content,
  tipo: isPro ? "pro" : "free",
};
}