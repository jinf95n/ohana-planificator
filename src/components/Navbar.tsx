import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OhanaLogo } from "./OhanaLogo";
import { LogIn, LogOut, Sparkles } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar = ({ isLoggedIn, userName, onLogin, onLogout }: NavbarProps) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container flex items-center justify-between py-5">
        <div className="flex items-center gap-2 text-cream">
          <Sparkles className="w-5 h-5" />
          <span className="font-serif-elegant italic text-base sm:text-lg">Ohana</span>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-cream/90 text-sm font-medium">
              Hola, {userName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-cream hover:text-cream hover:bg-cream/15 rounded-full"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Salir
            </Button>
          </div>
        ) : (
          <Button
            onClick={onLogin}
            size="sm"
            className="bg-cream text-ink hover:bg-cream/90 rounded-full font-semibold shadow-sm"
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  );
};
