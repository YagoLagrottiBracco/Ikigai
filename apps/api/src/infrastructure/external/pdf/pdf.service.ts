import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { IPdfService } from '@domain/services';
import { IkigaiSessionEntity } from '@domain/entities';
import { LIFE_STAGE_LABELS, IKIGAI_LABELS } from '@ikigai/shared';

// Colors matching the premium design
const COLORS = {
    love: '#FF6B6B',
    skills: '#4ECDC4',
    world: '#95D5B2',
    paid: '#FFD93D',
    ikigai: '#9D4EDD',
    bg: '#0A0A0B',
    bgSecondary: '#141416',
    surface: '#222226',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    border: '#3A3A3F'
};

@Injectable()
export class PdfService implements IPdfService {
    async generatePdf(session: IkigaiSessionEntity): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margin: 50,
                    info: {
                        Title: `Ikigai - ${session.context.name}`,
                        Author: 'Ikigai App',
                        Subject: 'Análise Personalizada do Ikigai',
                    },
                });

                const chunks: Buffer[] = [];
                doc.on('data', (chunk: Buffer) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // === COVER PAGE ===
                this.addCoverPage(doc, session);

                // === IKIGAI ANSWERS PAGE ===
                doc.addPage();
                this.addAnswersPage(doc, session);

                // === AI ANALYSIS PAGE ===
                if (session.aiAnalysis) {
                    doc.addPage();
                    this.addAnalysisPage(doc, session);
                }

                // === MOTIVATIONAL PAGE ===
                doc.addPage();
                this.addMotivationalPage(doc, session);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private addCoverPage(doc: PDFKit.PDFDocument, session: IkigaiSessionEntity): void {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Background color
        doc.rect(0, 0, pageWidth, pageHeight).fill('#0A0A0B');

        // Decorative circles (simulating the Ikigai diagram)
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2 - 50;
        const radius = 60;
        const circleColors = [COLORS.love, COLORS.skills, COLORS.world, COLORS.paid];
        const positions = [
            { x: centerX, y: centerY - 40 },
            { x: centerX + 40, y: centerY },
            { x: centerX, y: centerY + 40 },
            { x: centerX - 40, y: centerY }
        ];

        positions.forEach((pos, i) => {
            doc.circle(pos.x, pos.y, radius)
                .fillOpacity(0.3)
                .fill(circleColors[i]);
        });

        // Center circle (Ikigai)
        doc.fillOpacity(1);
        doc.circle(centerX, centerY, 30).fill(COLORS.ikigai);

        // Title
        doc.fillColor(COLORS.textPrimary)
            .fontSize(36)
            .font('Helvetica-Bold')
            .text('SEU IKIGAI', 0, centerY + 100, { align: 'center' });

        // User name
        doc.fillColor(COLORS.ikigai)
            .fontSize(24)
            .text(session.context.name, 0, centerY + 150, { align: 'center' });

        // User info
        doc.fillColor(COLORS.textSecondary)
            .fontSize(12)
            .font('Helvetica')
            .text(
                `${session.context.currentProfession} • ${session.context.age} anos • ${LIFE_STAGE_LABELS[session.context.lifeStage]}`,
                0, centerY + 180, { align: 'center' }
            );

        // Date
        doc.fillColor(COLORS.textMuted)
            .fontSize(10)
            .text(
                `Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`,
                0, pageHeight - 80, { align: 'center' }
            );
    }

    private addAnswersPage(doc: PDFKit.PDFDocument, session: IkigaiSessionEntity): void {
        // Page background
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0B');

        // Title
        doc.fillColor(COLORS.textPrimary)
            .fontSize(22)
            .font('Helvetica-Bold')
            .text('Suas Respostas', 50, 50);

        doc.moveDown(1.5);

        const sections = [
            { key: 'love', label: '❤️ ' + IKIGAI_LABELS.love, color: COLORS.love, items: session.answers.love },
            { key: 'skills', label: '💡 ' + IKIGAI_LABELS.skills, color: COLORS.skills, items: session.answers.skills },
            { key: 'worldNeeds', label: '🌍 ' + IKIGAI_LABELS.worldNeeds, color: COLORS.world, items: session.answers.worldNeeds },
            { key: 'paidFor', label: '💰 ' + IKIGAI_LABELS.paidFor, color: COLORS.paid, items: session.answers.paidFor },
        ];

        sections.forEach((section) => {
            this.addAnswerSection(doc, section.label, section.items, section.color);
        });
    }

    private addAnswerSection(doc: PDFKit.PDFDocument, title: string, items: string[], color: string): void {
        const y = doc.y;

        // Section title
        doc.fillColor(color)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(title, 50);

        // Items
        doc.fillColor(COLORS.textSecondary)
            .fontSize(11)
            .font('Helvetica');

        items.forEach((item) => {
            doc.text(`  • ${item}`, 55);
        });

        doc.moveDown(1);
    }

    private addAnalysisPage(doc: PDFKit.PDFDocument, session: IkigaiSessionEntity): void {
        const analysis = session.aiAnalysis!;

        // Page background
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0B');

        // Title
        doc.fillColor(COLORS.textPrimary)
            .fontSize(22)
            .font('Helvetica-Bold')
            .text('Análise Personalizada', 50, 50);

        doc.moveDown(1.5);

        // Profile Summary
        this.addAnalysisSection(doc, '✨ Resumo do seu Perfil', analysis.profileSummary, COLORS.ikigai);

        // Suggested Careers with ranking
        if (analysis.suggestedCareers.length > 0) {
            doc.fillColor(COLORS.world)
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('🎯 Carreiras Sugeridas (por compatibilidade)');

            doc.moveDown(0.5);
            doc.fillColor(COLORS.textSecondary)
                .fontSize(11)
                .font('Helvetica');

            analysis.suggestedCareers.forEach((career, index) => {
                const stars = '⭐'.repeat(5 - index);
                doc.text(`  ${index + 1}. ${career} ${stars}`);
            });

            doc.moveDown(1);
        }

        // Check if we need a new page
        if (doc.y > 650) {
            doc.addPage();
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0B');
            doc.y = 50;
        }

        // Identified Gaps
        if (analysis.identifiedGaps.length > 0) {
            doc.fillColor(COLORS.paid)
                .fontSize(14)
                .font('Helvetica-Bold')
                .text('⚠️ Pontos de Desenvolvimento');

            doc.moveDown(0.5);
            doc.fillColor(COLORS.textSecondary)
                .fontSize(11)
                .font('Helvetica');

            analysis.identifiedGaps.forEach((gap, index) => {
                doc.text(`  ${index + 1}. ${gap}`);
            });

            doc.moveDown(1);
        }

        // Action Plan
        this.addAnalysisSection(doc, '📋 Plano de Ação', analysis.actionPlan, COLORS.skills);

        // Situation Analysis
        if (analysis.currentSituationAnalysis) {
            // Check if we need a new page
            if (doc.y > 600) {
                doc.addPage();
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0B');
                doc.y = 50;
            }
            this.addAnalysisSection(doc, '📊 Análise da Situação Atual', analysis.currentSituationAnalysis, COLORS.love);
        }
    }

    private addAnalysisSection(doc: PDFKit.PDFDocument, title: string, content: string, color: string): void {
        doc.fillColor(color)
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(title);

        doc.moveDown(0.5);

        doc.fillColor(COLORS.textSecondary)
            .fontSize(11)
            .font('Helvetica')
            .text(content, { align: 'justify', lineGap: 2 });

        doc.moveDown(1.5);
    }

    private addMotivationalPage(doc: PDFKit.PDFDocument, session: IkigaiSessionEntity): void {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Page background
        doc.rect(0, 0, pageWidth, pageHeight).fill('#0A0A0B');

        // Decorative gradient-like rectangle
        doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
            .fillOpacity(0.1)
            .fill(COLORS.ikigai);

        doc.fillOpacity(1);

        // Quote icon
        doc.fillColor(COLORS.ikigai)
            .fontSize(60)
            .text('"', pageWidth / 2 - 20, 150);

        // Motivational quote
        doc.fillColor(COLORS.textPrimary)
            .fontSize(18)
            .font('Helvetica-BoldOblique')
            .text(
                'O seu Ikigai não é algo que você encontra de uma vez. É uma jornada de autodescoberta que continua a cada dia.',
                80, 220, { align: 'center', width: pageWidth - 160, lineGap: 6 }
            );

        // Personal message
        doc.moveDown(2);
        doc.fillColor(COLORS.textSecondary)
            .fontSize(14)
            .font('Helvetica')
            .text(
                `${session.context.name}, você deu um passo importante hoje ao explorar o seu propósito. Continue cultivando o que você ama, aprimorando suas habilidades, contribuindo para o mundo e encontrando formas de ser recompensado por isso.`,
                80, doc.y, { align: 'center', width: pageWidth - 160, lineGap: 4 }
            );

        // Call to action
        doc.moveDown(2);
        doc.fillColor(COLORS.ikigai)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('O próximo passo é seu. Comece hoje!', { align: 'center' });

        // 4 pillars reminder
        doc.moveDown(3);

        const pillars = [
            { emoji: '❤️', text: 'Ame o que faz', color: COLORS.love },
            { emoji: '💡', text: 'Use seus talentos', color: COLORS.skills },
            { emoji: '🌍', text: 'Ajude o mundo', color: COLORS.world },
            { emoji: '💰', text: 'Seja recompensado', color: COLORS.paid }
        ];

        const pillarWidth = (pageWidth - 100) / 4;
        pillars.forEach((pillar, i) => {
            const x = 50 + (i * pillarWidth);
            doc.fillColor(pillar.color)
                .fontSize(24)
                .text(pillar.emoji, x, 480, { width: pillarWidth, align: 'center' });
            doc.fillColor(COLORS.textSecondary)
                .fontSize(9)
                .text(pillar.text, x, 510, { width: pillarWidth, align: 'center' });
        });

        // Footer
        doc.fillColor(COLORS.textMuted)
            .fontSize(9)
            .text(
                '© Ikigai App • ikigai.app',
                0, pageHeight - 50, { align: 'center' }
            );
    }
}
