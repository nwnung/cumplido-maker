import { createClient } from '@/utils/supabase/server';
import { AuthSchemas, type SignUpData, type SignInData } from '@/lib/validations/auth';
import { emailService } from './email.service';

export class AuthService {
  private supabase = createClient();

  async signUp(data: SignUpData, redirectTo?: string) {
    const validated = AuthSchemas.signUp.parse(data);
    
    const { data: authData, error } = await this.supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          name: validated.name
        }
      }
    });

    if (error) {
      console.error('SignUp error:', error);
      throw new Error('AUTH_SIGNUP_FAILED');
    }

    return authData;
  }

  async signIn(data: SignInData) {
    const validated = AuthSchemas.signIn.parse(data);
    
    const { data: authData, error } = await this.supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      console.error('SignIn error:', error);
      throw new Error('AUTH_SIGNIN_FAILED');
    }

    return authData;
  }

  async resetPassword(email: string, redirectTo: string) {
    const validated = AuthSchemas.email.parse(email);
    
    // CRITICAL: Verificar que el usuario existe sin revelar info
    const { data: user } = await this.supabase
      .from('profiles')
      .select('email')
      .eq('email', validated)
      .single();

    // Siempre devolver success por seguridad
    const { error } = await this.supabase.auth.resetPasswordForEmail(validated, {
      redirectTo,
    });

    if (error && user) {
      console.error('Password reset error:', error);
      throw new Error('AUTH_RESET_FAILED');
    }

    return { success: true };
  }

  async updatePassword(newPassword: string) {
    const validated = AuthSchemas.password.parse(newPassword);
    
    const { data, error } = await this.supabase.auth.updateUser({
      password: validated
    });

    if (error) {
      console.error('Password update error:', error);
      throw new Error('AUTH_UPDATE_PASSWORD_FAILED');
    }

    return data;
  }
}

export const authService = new AuthService();