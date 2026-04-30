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
  creditosRestantes: number | null;   // cuántas le quedan hoy (plan diario)
  creditosBienvenida: number | null;  // cuántos créditos de bienvenida le quedan (solo free)
  plan: string;                       // "free" | "starter" | "pro" según Clerk
}

export async function generarPlanificacion(
  params: GeneracionParams,
  isPro: boolean,
  userId?: string
): Promise<GeneracionResult> {
  if (!WEBHOOK_URL) throw new Error("Webhook de n8n no configurado.");

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      tipo: isPro ? "pro" : "free",
      userId: userId ?? "anonimo",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
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

  // Créditos — n8n los manda en la misma respuesta
  const creditosRestantes = n8nData?.creditosRestantes != null
    ? parseInt(String(n8nData.creditosRestantes))
    : null;

  const creditosBienvenida = n8nData?.creditosBienvenida != null
    ? parseInt(String(n8nData.creditosBienvenida))
    : null;

  const plan = n8nData?.plan ?? (isPro ? "pro" : "free");

  return {
    content,
    tipo: isPro ? "pro" : "free",
    creditosRestantes,
    creditosBienvenida,
    plan,
  };
}