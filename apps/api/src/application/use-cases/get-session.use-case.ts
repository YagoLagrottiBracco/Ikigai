import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IkigaiSession } from '@ikigai/shared';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/repositories/session.repository';

@Injectable()
export class GetSessionUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
    ) { }

    async execute(hash: string): Promise<IkigaiSession> {
        const session = await this.sessionRepository.findByHash(hash);

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        return session.toPlainObject();
    }
}
