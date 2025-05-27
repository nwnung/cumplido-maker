import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifica tu Email | Generador de Cumplidos",
  description: "Revisa tu email para verificar tu cuenta",
};

export default function CheckEmailPage() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Revisa tu Email</CardTitle>
        <CardDescription>
          Te hemos enviado un enlace de verificación a tu correo electrónico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Haz clic en el enlace del email para verificar tu cuenta y completar
            el registro.
          </p>
          <p className="mt-2">Si no ves el email, revisa tu carpeta de spam.</p>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Volver al Login</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
