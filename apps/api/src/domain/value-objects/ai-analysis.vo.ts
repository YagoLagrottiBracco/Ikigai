import { AIAnalysis } from '@ikigai/shared';

/**
 * Value Object: Análise da IA
 * Representa o resultado da análise gerada pela IA
 */
export class AIAnalysisVO {
    constructor(
        public readonly profileSummary: string,
        public readonly suggestedCareers: string[],
        public readonly identifiedGaps: string[],
        public readonly actionPlan: string,
        public readonly currentSituationAnalysis: string,
        public readonly generatedAt: Date = new Date(),
    ) { }

    toPlainObject(): AIAnalysis {
        return {
            profileSummary: this.profileSummary,
            suggestedCareers: [...this.suggestedCareers],
            identifiedGaps: [...this.identifiedGaps],
            actionPlan: this.actionPlan,
            currentSituationAnalysis: this.currentSituationAnalysis,
            generatedAt: this.generatedAt,
        };
    }

    static fromPlainObject(obj: any): AIAnalysisVO | null {
        if (!obj) return null;
        return new AIAnalysisVO(
            obj.profileSummary,
            obj.suggestedCareers ?? [],
            obj.identifiedGaps ?? [],
            obj.actionPlan,
            obj.currentSituationAnalysis,
            obj.generatedAt ? new Date(obj.generatedAt) : new Date(),
        );
    }
}
