import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Cuenta | Generador de Cumplidos",
  description:
    "Crea tu cuenta para comenzar a generar cumplidos personalizados",
};

export default function SignupPage() {
  return <SignupForm />;
}
