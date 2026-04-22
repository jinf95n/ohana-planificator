import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { esES } from "@clerk/localizations";
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Falta VITE_CLERK_PUBLISHABLE_KEY en .env");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      localization={esES}
      appearance={{
        variables: {
          colorPrimary: "#E05A3A",       // coral de Ohana
          colorBackground: "#FDF8F3",    // cream
          colorText: "#1C1917",          // ink
          borderRadius: "1rem",
          fontFamily: "inherit",
        },
        elements: {
          card: "shadow-card-pro border border-cream-soft",
          headerTitle: "font-display text-2xl",
          socialButtonsBlockButton: "border border-cream-soft hover:bg-cream-soft",
          formButtonPrimary: "bg-coral hover:bg-coral/90",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);