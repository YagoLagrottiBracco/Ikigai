import { Inject, Injectable } from '@nestjs/common';
import { IkigaiContext, CreateSessionResponse } from '@ikigai/shared';
import { nanoid } from 'nanoid';
import { IkigaiSessionEntity } from '../../domain/entities/ikigai-session.entity';
import { UserContext } from '../../domain/value-objects/user-context.vo';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/repositories/session.repository';

@Injectable()
export class CreateSessionUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) { }

    async execute(contextData: IkigaiContext): Promise<CreateSessionResponse> {
        // Cria o Value Object do contexto (com validações)
        const context = new UserContext(
            contextData.name,
            contextData.age,
            contextData.currentProfession,
            contextData.educationArea,
            contextData.lifeStage,
            contextData.currentSituation,
        );

        // Gera hash único
        let hash: string;
        do {
            hash = nanoid(10);
        } while (await this.sessionRepository.hashExists(hash));

        // Cria a entidade
        const session = new IkigaiSessionEntity(
            '', // ID será gerado pelo MongoDB
            hash,
            context,
            new Date(),
        );

        // Persiste
        const savedSession = await this.sessionRepository.create(session);

        return {
            hash: savedSession.hash,
            session: savedSession.toPlainObject(),
        };
    }
}
