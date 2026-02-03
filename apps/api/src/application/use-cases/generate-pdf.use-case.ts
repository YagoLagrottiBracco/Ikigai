import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ISessionRepository, SESSION_REPOSITORY } from '../../domain/repositories/session.repository';
import { IPdfService, PDF_SERVICE } from '../../domain/services/pdf.service';

@Injectable()
export class GeneratePdfUseCase {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessionRepository: ISessionRepository,
        @Inject(PDF_SERVICE)
        private readonly pdfService: IPdfService,
    ) { }

    async execute(hash: string): Promise<Buffer> {
        const session = await this.sessionRepository.findByHash(hash);

        if (!session) {
            throw new NotFoundException('Sessão não encontrada');
        }

        if (session.status !== 'analyzed') {
            throw new BadRequestException('A sessão precisa ser analisada antes de gerar o PDF');
        }

        return this.pdfService.generatePdf(session);
    }
}
