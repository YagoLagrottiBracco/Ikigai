import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
    attachments?: Array<{
        filename: string;
        content: Buffer;
    }>;
}

@Injectable()
export class EmailService {
    private resend: Resend | null = null;
    private fromEmail: string;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');

        if (apiKey) {
            this.resend = new Resend(apiKey);
        } else {
            console.warn('RESEND_API_KEY não configurada - emails não serão enviados');
        }

        this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'Ikigai <onboarding@resend.dev>');
    }

    async sendIkigaiResult(to: string, name: string, pdfBuffer: Buffer): Promise<boolean> {
        console.log('📧 [EmailService] sendIkigaiResult chamado');
        console.log('📧 [EmailService] Para:', to);
        console.log('📧 [EmailService] Nome:', name);
        console.log('📧 [EmailService] PDF Buffer size:', pdfBuffer?.length || 0, 'bytes');

        const html = this.generateResultEmailTemplate(name);

        return this.sendEmail({
            to,
            subject: `🎯 ${name}, seu Ikigai está pronto!`,
            html,
            attachments: [
                {
                    filename: `ikigai-${name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
                    content: pdfBuffer
                }
            ]
        });
    }

    private async sendEmail(params: SendEmailParams): Promise<boolean> {
        console.log('📧 [EmailService] sendEmail chamado');
        console.log('📧 [EmailService] Resend configurado:', !!this.resend);
        console.log('📧 [EmailService] From:', this.fromEmail);

        if (!this.resend) {
            console.log('⚠️ [Demo Mode] Email que seria enviado para:', params.to);
            console.log('⚠️ [Demo Mode] Assunto:', params.subject);
            console.log('⚠️ [Demo Mode] Anexos:', params.attachments?.length || 0);
            return true;
        }

        try {
            console.log('📧 [EmailService] Enviando via Resend...');
            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: params.to,
                subject: params.subject,
                html: params.html,
                attachments: params.attachments?.map(att => ({
                    filename: att.filename,
                    content: att.content
                }))
            });

            // Verificar se houve erro na resposta do Resend
            if (result.error) {
                console.error('❌ [EmailService] Erro do Resend:', result.error);
                console.error('❌ [EmailService] Código:', result.error.statusCode);
                console.error('❌ [EmailService] Mensagem:', result.error.message);
                return false;
            }

            console.log('✅ [EmailService] Email enviado com sucesso!', result.data);
            return true;
        } catch (error) {
            console.error('❌ [EmailService] Erro ao enviar email:', error);
            return false;
        }
    }

    private generateResultEmailTemplate(name: string): string {
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Ikigai está Pronto!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0B; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0A0A0B;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(34, 34, 38, 0.9) 0%, rgba(28, 28, 31, 0.9) 100%); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9D4EDD 0%, #4ECDC4 100%); border-radius: 20px; display: inline-block; line-height: 80px; font-size: 40px;">
                                🎯
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding: 0 40px 20px;">
                            <h1 style="margin: 0; color: #FAFAFA; font-size: 28px; font-weight: 700;">
                                Olá, <span style="background: linear-gradient(135deg, #9D4EDD 0%, #4ECDC4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${name}</span>! 👋
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                <strong style="color: #FAFAFA;">Seu Ikigai foi revelado!</strong> Anexamos o PDF completo com sua análise personalizada, incluindo:
                            </p>
                            
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <span style="color: #4ECDC4; font-size: 18px;">✓</span>
                                        <span style="color: #A1A1AA; padding-left: 10px;">Seu diagrama Ikigai personalizado</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <span style="color: #4ECDC4; font-size: 18px;">✓</span>
                                        <span style="color: #A1A1AA; padding-left: 10px;">Ranking de carreiras compatíveis</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <span style="color: #4ECDC4; font-size: 18px;">✓</span>
                                        <span style="color: #A1A1AA; padding-left: 10px;">Pontos de desenvolvimento</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <span style="color: #4ECDC4; font-size: 18px;">✓</span>
                                        <span style="color: #A1A1AA; padding-left: 10px;">Plano de ação personalizado</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Motivational Quote -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background: linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #9D4EDD;">
                                <p style="color: #FAFAFA; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic;">
                                    "O segredo para uma vida plena não é encontrar o trabalho perfeito, mas sim encontrar a interseção entre o que você ama, o que você é bom, o que o mundo precisa e pelo que você pode ser pago."
                                </p>
                                <p style="color: #A1A1AA; font-size: 14px; margin: 10px 0 0;">
                                    — Filosofia Ikigai
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA -->
                    <tr>
                        <td align="center" style="padding: 0 40px 30px;">
                            <p style="color: #A1A1AA; font-size: 14px; margin: 0;">
                                Lembre-se: seu Ikigai é uma jornada, não um destino. Cada passo em direção à sua essência conta! 🚀
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                            <p style="color: #71717A; font-size: 12px; margin: 0; text-align: center;">
                                © ${new Date().getFullYear()} Ikigai. Todos os direitos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();
    }
}

export const EMAIL_SERVICE = Symbol('EmailService');
