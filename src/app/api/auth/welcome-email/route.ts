import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/email.service";
import { z } from "zod";

const WelcomeEmailSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = WelcomeEmailSchema.parse(body);

    await emailService.sendWelcomeEmail(email, name || "Usuario");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al enviar email de bienvenida" },
      { status: 500 }
    );
  }
}
