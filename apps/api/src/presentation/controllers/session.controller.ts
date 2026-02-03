import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateSessionDto, UpdateAnswersDto } from '../dto';
import {
    CreateSessionUseCase,
    GetSessionUseCase,
    UpdateAnswersUseCase,
    AnalyzeSessionUseCase,
    GeneratePdfUseCase,
    SendResultEmailUseCase,
} from '../../application/use-cases';

@Controller('sessions')
export class SessionController {
    constructor(
        private readonly createSessionUseCase: CreateSessionUseCase,
        private readonly getSessionUseCase: GetSessionUseCase,
        private readonly updateAnswersUseCase: UpdateAnswersUseCase,
        private readonly analyzeSessionUseCase: AnalyzeSessionUseCase,
        private readonly generatePdfUseCase: GeneratePdfUseCase,
        private readonly sendResultEmailUseCase: SendResultEmailUseCase,
    ) { }

    /**
     * POST /api/sessions
     * Cria uma nova sessão
     */
    @Post()
    async createSession(@Body() dto: CreateSessionDto) {
        return this.createSessionUseCase.execute(dto);
    }

    /**
     * GET /api/sessions/:hash
     * Busca uma sessão pelo hash
     */
    @Get(':hash')
    async getSession(@Param('hash') hash: string) {
        return this.getSessionUseCase.execute(hash);
    }

    /**
     * PATCH /api/sessions/:hash/answers
     * Atualiza as respostas de uma sessão
     */
    @Patch(':hash/answers')
    async updateAnswers(
        @Param('hash') hash: string,
        @Body() dto: UpdateAnswersDto,
    ) {
        return this.updateAnswersUseCase.execute(hash, dto);
    }

    /**
     * POST /api/sessions/:hash/analyze
     * Dispara a análise da IA
     */
    @Post(':hash/analyze')
    async analyzeSession(@Param('hash') hash: string) {
        return this.analyzeSessionUseCase.execute(hash);
    }

    /**
     * GET /api/sessions/:hash/pdf
     * Gera e retorna o PDF
     */
    @Get(':hash/pdf')
    async generatePdf(@Param('hash') hash: string, @Res() res: Response) {
        const pdfBuffer = await this.generatePdfUseCase.execute(hash);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="ikigai-${hash}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        res.status(HttpStatus.OK).send(pdfBuffer);
    }

    /**
     * POST /api/sessions/:hash/send-email
     * Envia o resultado por email
     */
    @Post(':hash/send-email')
    async sendEmail(
        @Param('hash') hash: string,
        @Body() body: { email: string }
    ) {
        console.log('📬 [SessionController] POST /send-email recebido');
        console.log('📬 [SessionController] Hash:', hash);
        console.log('📬 [SessionController] Body:', body);

        try {
            await this.sendResultEmailUseCase.execute(hash, body.email);
            console.log('✅ [SessionController] Email enviado com sucesso!');
            return { success: true, message: 'Email enviado com sucesso!' };
        } catch (error) {
            console.error('❌ [SessionController] Erro ao enviar email:', error);
            throw error;
        }
    }
}
