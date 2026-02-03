import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IkigaiSession } from '@ikigai/shared';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/repositories/session.repository';
import { IAIService, AI_SERVICE } from '../../domain/services/ai.service';

@Injectable()
export class AnalyzeSessionUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(AI_SERVICE)
        private readonly aiService: IAIService,
    ) { }

    async execute(hash: string): Promise<IkigaiSession> {
        const session = await this.sessionRepository.findByHash(hash);

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        if (!session.canBeAnalyzed()) {
            throw new BadRequestException('Sessão não pode ser analisada. Complete todas as respostas primeiro.');
        }

        // Já foi analisada? Retorna o resultado existente
        if (session.status === 'analyzed' && session.aiAnalysis) {
            return session.toPlainObject();
        }

        // Chama a IA para análise
        const analysis = await this.aiService.analyzeSession(session);

        // Atualiza a sessão com a análise
        session.setAIAnalysis(analysis);

        // Persiste
        const updatedSession = await this.sessionRepository.update(session);

        return updatedSession.toPlainObject();
    }
}
