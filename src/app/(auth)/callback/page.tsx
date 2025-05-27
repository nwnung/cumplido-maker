import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string };
}) {
  const { code, error } = searchParams;

  if (error) {
    // Si hay un error en la verificación, redirigir al login con mensaje
    redirect(`/auth/login?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();

    // Intercambiar el código por una sesión
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      redirect(
        `/auth/login?error=${encodeURIComponent("Error al verificar el email")}`
      );
    }

    // Verificación exitosa, redirigir al dashboard
    redirect("/dashboard");
  }

  // Si no hay código ni error, redirigir al login
  redirect("/auth/login");
}
