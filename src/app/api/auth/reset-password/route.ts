import { authService } from '@/lib/services/auth.service';
import { AuthSchemas } from '@/lib/validations/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = AuthSchemas.resetPassword.parse(body);
    
    const redirectTo = `${request.nextUrl.origin}/auth/callback?type=recovery`;
    await authService.resetPassword(email, redirectTo);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message }, 
        { status: 400 }
      );
    }
    
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}