import { ProductoProximamente } from "@/components/ProductoProximamente";

export const ActosEscolares = () => (
  <ProductoProximamente config={{
    id: "actos-escolares",
    nombre: "Actos escolares",
    tagline: "Actos que emocionan y tienen sentido pedagógico.",
    descripcion: "Organizar un acto escolar implica guión, cronograma, discursos y coordinación — todo en poco tiempo. Ohana te da la estructura completa para que puedas enfocarte en lo que importa: el momento.",
    paraQuien: [
      "Docentes y preceptores a cargo de organizar actos patrios o eventos institucionales.",
      "Directivos que necesitan discursos o palabras de apertura con contenido pedagógico real.",
      "Equipos docentes que quieren actos con propósito, no solo protocolares.",
    ],
    features: [
      "Guiones completos para actos patrios adaptados al nivel y la fecha conmemorativa.",
      "Cronogramas de organización con roles y tiempos claros.",
      "Discursos y palabras de apertura con contexto histórico y mensaje educativo.",
      "Ideas de actividades participativas para que el acto tenga sentido para los alumnos.",
    ],
  }} />
);