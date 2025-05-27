import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Generador de Cumplidos",
  description:
    "Inicia sesión en tu cuenta para generar cumplidos personalizados",
};

export default function LoginPage() {
  return <LoginForm />;
}
