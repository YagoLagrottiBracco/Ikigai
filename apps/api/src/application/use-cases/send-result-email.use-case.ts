import { Injectable, Inject } from '@nestjs/common';
import { ISessionRepository, SESSION_REPOSITORY } from '@domain/repositories';
import { IPdfService, PDF_SERVICE } from '@domain/services';
import { EmailService } from '../../infrastructure/external/email/email.service';

@Injectable()
export class SendResultEmailUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(PDF_SERVICE)
        private readonly pdfService: IPdfService,
        private readonly emailService: EmailService
    ) { }

    async execute(hash: string, email: string): Promise<boolean> {
        console.log('📨 [SendResultEmailUseCase] Iniciando...');
        console.log('📨 [SendResultEmailUseCase] Hash:', hash);
        console.log('📨 [SendResultEmailUseCase] Email destino:', email);

        const session = await this.sessionRepository.findByHash(hash);
        if (!session) {
            console.error('❌ [SendResultEmailUseCase] Sessão não encontrada');
            throw new Error('Sessão não encontrada');
        }
        console.log('📨 [SendResultEmailUseCase] Sessão encontrada:', session.id);
        console.log('📨 [SendResultEmailUseCase] Nome:', session.context?.name);

        if (!session.aiAnalysis) {
            console.error('❌ [SendResultEmailUseCase] Análise não gerada');
            throw new Error('Análise ainda não foi gerada');
        }
        console.log('📨 [SendResultEmailUseCase] Análise encontrada');

        // Generate PDF
        console.log('📨 [SendResultEmailUseCase] Gerando PDF...');
        const pdfBuffer = await this.pdfService.generatePdf(session);
        console.log('📨 [SendResultEmailUseCase] PDF gerado:', pdfBuffer?.length || 0, 'bytes');

        // Send email with PDF attached
        console.log('📨 [SendResultEmailUseCase] Enviando email...');
        const success = await this.emailService.sendIkigaiResult(
            email,
            session.context.name,
            pdfBuffer
        );

        if (!success) {
            console.error('❌ [SendResultEmailUseCase] Falha ao enviar email');
            throw new Error('Falha ao enviar email');
        }

        console.log('✅ [SendResultEmailUseCase] Email enviado com sucesso!');
        return true;
    }
}
