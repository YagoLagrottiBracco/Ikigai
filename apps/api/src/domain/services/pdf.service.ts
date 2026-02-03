import { IkigaiSessionEntity } from '../entities/ikigai-session.entity';

/**
 * Interface do Serviço de PDF
 * Abstração para geração de PDF
 */
export interface IPdfService {
    /**
     * Gera PDF da sessão
     */
    generatePdf(session: IkigaiSessionEntity): Promise<Buffer>;
}

export const PDF_SERVICE = Symbol('IPdfService');
