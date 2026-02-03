import type { IkigaiContext, IkigaiAnswers, IkigaiSession } from './ikigai';
/**
 * DTO para criar uma nova sessão
 */
export interface CreateSessionDTO {
    context: IkigaiContext;
}
/**
 * DTO para atualizar respostas
 */
export interface UpdateAnswersDTO {
    answers: Partial<IkigaiAnswers>;
}
/**
 * Resposta da criação de sessão
 */
export interface CreateSessionResponse {
    hash: string;
    session: IkigaiSession;
}
/**
 * Resposta genérica da API
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Resposta da análise da IA
 */
export interface AnalyzeResponse {
    session: IkigaiSession;
}
//# sourceMappingURL=api.d.ts.map