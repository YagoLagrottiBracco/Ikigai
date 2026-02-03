/**
 * Estágios de vida disponíveis
 */
export type LifeStage = 'student' | 'employed' | 'unemployed' | 'transition' | 'retired';
/**
 * Contexto inicial do usuário
 */
export interface IkigaiContext {
    name: string;
    age: number;
    currentProfession: string;
    educationArea: string;
    lifeStage: LifeStage;
    currentSituation: string;
}
/**
 * Respostas dos 4 pilares do Ikigai
 */
export interface IkigaiAnswers {
    love: string[];
    skills: string[];
    worldNeeds: string[];
    paidFor: string[];
}
/**
 * Análise gerada pela IA
 */
export interface AIAnalysis {
    profileSummary: string;
    suggestedCareers: string[];
    identifiedGaps: string[];
    actionPlan: string;
    currentSituationAnalysis: string;
    generatedAt: Date;
}
/**
 * Status da sessão
 */
export type SessionStatus = 'in_progress' | 'completed' | 'analyzed';
/**
 * Sessão completa do Ikigai
 */
export interface IkigaiSession {
    id: string;
    hash: string;
    createdAt: Date;
    updatedAt: Date;
    context: IkigaiContext;
    answers: IkigaiAnswers;
    aiAnalysis?: AIAnalysis;
    status: SessionStatus;
}
/**
 * Perguntas de cada pilar do Ikigai
 */
export interface IkigaiQuestions {
    love: string[];
    skills: string[];
    worldNeeds: string[];
    paidFor: string[];
}
/**
 * Cores do Ikigai para o diagrama
 */
export declare const IKIGAI_COLORS: {
    readonly love: "#E57373";
    readonly skills: "#64B5F6";
    readonly worldNeeds: "#81C784";
    readonly paidFor: "#FFD54F";
    readonly passion: "#9575CD";
    readonly mission: "#4DB6AC";
    readonly vocation: "#AED581";
    readonly profession: "#FFB74D";
    readonly ikigai: "#F8BBD9";
};
/**
 * Labels em português para cada elemento
 */
export declare const IKIGAI_LABELS: {
    readonly love: "O que você ama";
    readonly skills: "O que você é bom";
    readonly worldNeeds: "O que o mundo precisa";
    readonly paidFor: "Pelo que pode ser pago";
    readonly passion: "Paixão";
    readonly mission: "Missão";
    readonly vocation: "Vocação";
    readonly profession: "Profissão";
    readonly ikigai: "Ikigai";
};
/**
 * Labels dos estágios de vida
 */
export declare const LIFE_STAGE_LABELS: Record<LifeStage, string>;
//# sourceMappingURL=ikigai.d.ts.map