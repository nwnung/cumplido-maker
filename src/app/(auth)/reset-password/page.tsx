"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { AuthSchemas, type ResetPasswordData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(AuthSchemas.resetPassword),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast.error("Error al enviar email", {
          description: error.message || "Ha ocurrido un error inesperado",
        });
        return;
      }

      setEmailSent(true);
      toast.success("Email enviado", {
        description: "Revisa tu correo para restablecer tu contraseña",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Error al enviar email", {
        description: "Ha ocurrido un error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Email Enviado</CardTitle>
          <CardDescription>
            Revisa tu correo electrónico para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Te hemos enviado un enlace para restablecer tu contraseña.</p>
            <p className="mt-2">
              Si no ves el email, revisa tu carpeta de spam.
            </p>
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Restablecer Contraseña
        </CardTitle>
        <CardDescription>
          Ingresa tu email para recibir un enlace de restablecimiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tu@email.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Email"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link
            href="/auth/login"
            className="text-muted-foreground hover:text-primary hover:underline"
          >
            Volver al Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
