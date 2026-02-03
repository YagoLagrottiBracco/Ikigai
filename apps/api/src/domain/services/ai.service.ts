import { IkigaiSessionEntity } from '../entities/ikigai-session.entity';
import { AIAnalysisVO } from '../value-objects/ai-analysis.vo';

/**
 * Interface do Serviço de IA
 * Abstração para integração com IA (Gemini)
 */
export interface IAIService {
    /**
     * Analisa uma sessão e retorna a análise da IA
     */
    analyzeSession(session: IkigaiSessionEntity): Promise<AIAnalysisVO>;
}

export const AI_SERVICE = Symbol('IAIService');
