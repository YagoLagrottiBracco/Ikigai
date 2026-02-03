import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionDocument, SessionSchema } from './database/schemas/session.schema';
import { MongoSessionRepository } from './database/repositories/mongo-session.repository';
import { GeminiService } from './external/gemini/gemini.service';
import { PdfService } from './external/pdf/pdf.service';
import { StripeService } from './external/stripe/stripe.service';
import { EmailService } from './external/email/email.service';
import { SESSION_REPOSITORY } from '../domain/repositories/session.repository';
import { AI_SERVICE } from '../domain/services/ai.service';
import { PDF_SERVICE } from '../domain/services/pdf.service';

export const EMAIL_SERVICE = Symbol('EmailService');

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SessionDocument.name, schema: SessionSchema },
        ]),
    ],
    providers: [
        {
            provide: SESSION_REPOSITORY,
            useClass: MongoSessionRepository,
        },
        {
            provide: AI_SERVICE,
            useClass: GeminiService,
        },
        {
            provide: PDF_SERVICE,
            useClass: PdfService,
        },
        StripeService,
        EmailService,
    ],
    exports: [SESSION_REPOSITORY, AI_SERVICE, PDF_SERVICE, StripeService, EmailService],
})
export class InfrastructureModule { }
