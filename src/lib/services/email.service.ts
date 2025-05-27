import { resend } from '@/lib/resend';
import { AuthSchemas } from '@/lib/validations/auth';

interface EmailConfig {
  from: string;
  appName: string;
  appUrl: string;
}

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  private validateEmailData(email: string, url: string, name?: string) {
    return AuthSchemas.emailTemplate.parse({ email, url, name });
  }

  async sendVerificationEmail(email: string, confirmationUrl: string, userName?: string) {
    const validated = this.validateEmailData(email, confirmationUrl, userName);

    try {
      await resend.emails.send({
        from: this.config.from,
        to: validated.email,
        subject: `Verifica tu cuenta - ${this.config.appName}`,
        html: this.getVerificationTemplate(validated.url, userName),
      });
    } catch (error) {
      console.error('Verification email error:', error);
      // CRITICAL: No exponer detalles del error al cliente
      throw new Error('EMAIL_SEND_FAILED');
    }
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const validated = this.validateEmailData(email, resetUrl);

    try {
      await resend.emails.send({
        from: this.config.from,
        to: validated.email,
        subject: `Restablecer contraseña - ${this.config.appName}`,
        html: this.getPasswordResetTemplate(validated.url),
      });
    } catch (error) {
      console.error('Password reset email error:', error);
      throw new Error('EMAIL_SEND_FAILED');
    }
  }

  private getVerificationTemplate(url: string, userName?: string) {
    return `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>¡Hola ${userName || 'ahí'}! 👋</h2>
        <p>Gracias por registrarte en ${this.config.appName}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background: #000; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Verificar Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Link válido por 24 horas. Si no creaste esta cuenta, ignora este email.
        </p>
      </div>
    `;
  }

  private getPasswordResetTemplate(url: string) {
    return `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Restablecer contraseña 🔐</h2>
        <p>Solicitud para restablecer tu contraseña en ${this.config.appName}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background: #dc2626; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Link válido por 1 hora. Si no solicitaste esto, ignora este email.
        </p>
      </div>
    `;
  }
}

// Instancia singleton para toda la app
export const emailService = new EmailService({
  from: `${process.env.APP_NAME} <auth@${process.env.DOMAIN}>`,
  appName: process.env.APP_NAME || 'Tu SaaS',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
});