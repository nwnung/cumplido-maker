"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AuthSchemas, type SignUpData } from "@/lib/validations/auth";
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

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<SignUpData>({
    resolver: zodResolver(AuthSchemas.signUp),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Usuario ya existe", {
            description:
              "Este email ya está registrado. Intenta iniciar sesión.",
          });
        } else {
          toast.error("Error al registrarse", {
            description: error.message || "Ha ocurrido un error inesperado",
          });
        }
        return;
      }

      if (authData.user) {
        // Si el usuario necesita confirmar email
        if (!authData.session) {
          toast.success("¡Registro exitoso!", {
            description: "Revisa tu email para confirmar tu cuenta",
          });
          router.push("/auth/check-email");
        } else {
          // Si no necesita confirmación, redirigir directamente
          toast.success("¡Bienvenido!", {
            description: "Tu cuenta ha sido creada exitosamente",
          });

          // Enviar email de bienvenida
          try {
            await fetch("/api/auth/welcome-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: data.email,
                name: data.name,
              }),
            });
          } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
            // No mostrar error al usuario ya que el registro fue exitoso
          }

          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Error al registrarse", {
        description: "Ha ocurrido un error inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para crear una nueva cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu nombre"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mínimo 8 caracteres"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
