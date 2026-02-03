import { SessionStatus, IkigaiSession as IIkigaiSession, IkigaiAnswers } from '@ikigai/shared';
import { UserContext } from '../value-objects/user-context.vo';
import { IkigaiAnswersVO } from '../value-objects/ikigai-answers.vo';
import { AIAnalysisVO } from '../value-objects/ai-analysis.vo';

/**
 * Entidade Agregada: Sessão do Ikigai
 * Representa uma sessão completa do questionário
 */
export class IkigaiSessionEntity {
    private _status: SessionStatus;
    private _answers: IkigaiAnswersVO;
    private _aiAnalysis: AIAnalysisVO | null;
    private _updatedAt: Date;

    constructor(
        private readonly _id: string,
        private readonly _hash: string,
        private readonly _context: UserContext,
        private readonly _createdAt: Date,
        answers: IkigaiAnswersVO = IkigaiAnswersVO.empty(),
        status: SessionStatus = 'in_progress',
        aiAnalysis: AIAnalysisVO | null = null,
        updatedAt?: Date,
    ) {
        this._answers = answers;
        this._status = status;
        this._aiAnalysis = aiAnalysis;
        this._updatedAt = updatedAt ?? new Date();
    }

    // Getters
    get id(): string { return this._id; }
    get hash(): string { return this._hash; }
    get context(): UserContext { return this._context; }
    get answers(): IkigaiAnswersVO { return this._answers; }
    get status(): SessionStatus { return this._status; }
    get aiAnalysis(): AIAnalysisVO | null { return this._aiAnalysis; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }

    /**
     * Atualiza as respostas do questionário
     */
    updateAnswers(partialAnswers: Partial<IkigaiAnswers>): void {
        this._answers = this._answers.merge(partialAnswers);
        this._updatedAt = new Date();

        // Atualiza status se todas as respostas estiverem completas
        if (this._answers.isComplete() && this._status === 'in_progress') {
            this._status = 'completed';
        }
    }

    /**
     * Define a análise da IA
     */
    setAIAnalysis(analysis: AIAnalysisVO): void {
        if (this._status !== 'completed') {
            throw new Error('Não é possível analisar uma sessão incompleta');
        }
        this._aiAnalysis = analysis;
        this._status = 'analyzed';
        this._updatedAt = new Date();
    }

    /**
     * Verifica se a sessão pode ser analisada
     */
    canBeAnalyzed(): boolean {
        return this._status === 'completed' && this._answers.isComplete();
    }

    /**
     * Converte para objeto plano (para persistência)
     */
    toPlainObject(): IIkigaiSession {
        return {
            id: this._id,
            hash: this._hash,
            context: this._context.toPlainObject(),
            answers: this._answers.toPlainObject(),
            status: this._status,
            aiAnalysis: this._aiAnalysis?.toPlainObject(),
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    /**
     * Cria entidade a partir de objeto plano (da persistência)
     */
    static fromPlainObject(obj: any): IkigaiSessionEntity {
        return new IkigaiSessionEntity(
            obj.id ?? obj._id?.toString(),
            obj.hash,
            UserContext.fromPlainObject(obj.context),
            new Date(obj.createdAt),
            IkigaiAnswersVO.fromPlainObject(obj.answers),
            obj.status,
            AIAnalysisVO.fromPlainObject(obj.aiAnalysis),
            obj.updatedAt ? new Date(obj.updatedAt) : undefined,
        );
    }
}
