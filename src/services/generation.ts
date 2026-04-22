const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export interface GeneracionParams {
  docente: string;
  institucion: string;
  grado: string;
  materia: string;
  fecha: string;
  duracion: string;
  tema: string;
  objetivo: string;
  contexto?: string;
}

export interface GeneracionResult {
  content: string;
  tipo: "free" | "pro";
}

export async function generarPlanificacion(
  params: GeneracionParams,
  isPro: boolean,
  userId?: string          // ← nuevo: se manda a n8n para control de cuota
): Promise<GeneracionResult> {
  if (!WEBHOOK_URL) throw new Error("Webhook de n8n no configurado.");

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      tipo: isPro ? "pro" : "free",
      userId: userId ?? "anonimo",   // n8n usará esto para el rate limit
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    // n8n puede devolver mensaje de cuota agotada
    if (response.status === 429 || errorText.toLowerCase().includes("cuota")) {
      throw new Error("cuota_agotada");
    }
    throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
  }

  const result = await response.json();
  const n8nData = Array.isArray(result) ? result[0] : result;
  const raw = n8nData?.content ?? n8nData?.text ?? "";
  const content = raw.startsWith("=") ? raw.slice(1) : raw;

  if (!content) throw new Error("La respuesta llegó vacía. Intentá de nuevo.");

  return { content, tipo: isPro ? "pro" : "free" };
}