import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IAIService } from '../../../domain/services/ai.service';
import { IkigaiSessionEntity } from '../../../domain/entities/ikigai-session.entity';
import { AIAnalysisVO } from '../../../domain/value-objects/ai-analysis.vo';
import { LIFE_STAGE_LABELS } from '@ikigai/shared';

@Injectable()
export class GeminiService implements IAIService {
    private model: GenerativeModel;
    private maxRetries = 3;
    private baseDelay = 2000; // 2 seconds

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY não configurada');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async analyzeSession(session: IkigaiSessionEntity): Promise<AIAnalysisVO> {
        const prompt = this.buildPrompt(session);
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            try {
                const result = await this.model.generateContent(prompt);
                const response = result.response;
                const text = response.text();

                // Remove possíveis marcadores de código markdown
                const cleanText = text
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();

                const analysis = JSON.parse(cleanText);

                return new AIAnalysisVO(
                    analysis.profileSummary || '',
                    analysis.suggestedCareers || [],
                    analysis.identifiedGaps || [],
                    analysis.actionPlan || '',
                    analysis.currentSituationAnalysis || '',
                    new Date(),
                );
            } catch (error: any) {
                lastError = error;
                console.error(`Tentativa ${attempt + 1}/${this.maxRetries} falhou:`, error.message || error);

                // Se for erro 429 (rate limit), aguardar antes de tentar novamente
                if (error.status === 429) {
                    const delay = this.baseDelay * Math.pow(2, attempt); // Exponential backoff
                    console.log(`Rate limit atingido. Aguardando ${delay / 1000}s antes de tentar novamente...`);
                    await this.sleep(delay);
                    continue;
                }

                // Para outros erros, não tentar novamente
                break;
            }
        }

        console.error('Erro ao analisar com Gemini após todas as tentativas:', lastError);
        throw new Error('Falha ao processar análise da IA. Aguarde alguns segundos e tente novamente.');
    }

    private buildPrompt(session: IkigaiSessionEntity): string {
        const context = session.context;
        const answers = session.answers;

        return `
Você é um coach de carreira especializado no método Ikigai. 
Analise as respostas abaixo e forneça uma análise completa em português brasileiro.
Seja empático, motivador e prático nas suas sugestões.

## CONTEXTO DO USUÁRIO
Nome: ${context.name}
Idade: ${context.age} anos
Profissão atual: ${context.currentProfession}
Área de formação: ${context.educationArea || 'Não informada'}
Momento de vida: ${LIFE_STAGE_LABELS[context.lifeStage]}
Situação atual: ${context.currentSituation || 'Não informada'}

## RESPOSTAS DO IKIGAI

### O que ama (Paixão):
${answers.love.map(a => `- ${a}`).join('\n') || '- Nenhuma resposta'}

### O que é bom (Habilidades):
${answers.skills.map(a => `- ${a}`).join('\n') || '- Nenhuma resposta'}

### O que o mundo precisa (Missão):
${answers.worldNeeds.map(a => `- ${a}`).join('\n') || '- Nenhuma resposta'}

### Pelo que pode ser pago (Profissão):
${answers.paidFor.map(a => `- ${a}`).join('\n') || '- Nenhuma resposta'}

## INSTRUÇÕES
Analise profundamente as respostas, identifique padrões, conexões entre os 4 pilares e gaps.
Retorne APENAS um JSON válido (sem markdown, sem explicações) com a seguinte estrutura:
{
  "profileSummary": "Resumo detalhado de 2-3 parágrafos sobre o perfil desta pessoa, seus pontos fortes e sua essência com base nas respostas",
  "suggestedCareers": ["Carreira 1: breve explicação de por que se encaixa", "Carreira 2: breve explicação", "Carreira 3: breve explicação", "...até 5 carreiras"],
  "identifiedGaps": ["Gap 1: descrição do gap e como resolver", "Gap 2: descrição e solução", "...até 4 gaps"],
  "actionPlan": "Plano de ação prático em texto corrido com 5-7 passos concretos que a pessoa pode começar a fazer hoje/esta semana/este mês para se aproximar do seu Ikigai",
  "currentSituationAnalysis": "Análise de como a situação atual da pessoa se relaciona com seu Ikigai e recomendações específicas para o momento de vida dela"
}
`.trim();
    }
}
