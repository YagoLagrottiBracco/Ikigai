import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IkigaiAnswers, IkigaiSession } from '@ikigai/shared';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/repositories/session.repository';

@Injectable()
export class UpdateAnswersUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) { }

    async execute(hash: string, answers: Partial<IkigaiAnswers>): Promise<IkigaiSession> {
        const session = await this.sessionRepository.findByHash(hash);

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        // Atualiza respostas na entidade
        session.updateAnswers(answers);

        // Persiste
        const updatedSession = await this.sessionRepository.update(session);

        return updatedSession.toPlainObject();
    }
}
