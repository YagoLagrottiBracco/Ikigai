/**
 * Estágios de vida disponíveis
 */
export type LifeStage =
    | 'student'
    | 'employed'
    | 'unemployed'
    | 'transition'
    | 'retired';

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
    love: string[];      // O que você ama
    skills: string[];    // O que você é bom
    worldNeeds: string[]; // O que o mundo precisa
    paidFor: string[];   // Pelo que pode ser pago
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
export const IKIGAI_COLORS = {
    love: '#E57373',      // Vermelho coral
    skills: '#64B5F6',    // Azul céu
    worldNeeds: '#81C784', // Verde menta
    paidFor: '#FFD54F',   // Amarelo dourado
    passion: '#9575CD',   // Amor + Skills
    mission: '#4DB6AC',   // Amor + Mundo
    vocation: '#AED581',  // Mundo + Pago
    profession: '#FFB74D', // Skills + Pago
    ikigai: '#F8BBD9',    // Centro
} as const;

/**
 * Labels em português para cada elemento
 */
export const IKIGAI_LABELS = {
    love: 'O que você ama',
    skills: 'O que você é bom',
    worldNeeds: 'O que o mundo precisa',
    paidFor: 'Pelo que pode ser pago',
    passion: 'Paixão',
    mission: 'Missão',
    vocation: 'Vocação',
    profession: 'Profissão',
    ikigai: 'Ikigai',
} as const;

/**
 * Labels dos estágios de vida
 */
export const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
    student: 'Estudante',
    employed: 'Empregado(a)',
    unemployed: 'Desempregado(a)',
    transition: 'Em transição de carreira',
    retired: 'Aposentado(a)',
};
