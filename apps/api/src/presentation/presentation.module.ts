import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationModule } from '../application/application.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SessionController } from './controllers/session.controller';
import { PaymentController } from './controllers/payment.controller';
import { AdminController } from './controllers/admin.controller';
import { StripeService } from '../infrastructure/external/stripe/stripe.service';
import { AnalyzeSessionUseCase, SendResultEmailUseCase } from '../application/use-cases';
import { SessionDocument, SessionSchema } from '../infrastructure/database/schemas/session.schema';

@Module({
    imports: [
        ApplicationModule,
        InfrastructureModule,
        MongooseModule.forFeature([
            { name: SessionDocument.name, schema: SessionSchema },
        ]),
    ],
    controllers: [SessionController, PaymentController, AdminController],
    providers: [
        StripeService,
        AnalyzeSessionUseCase,
        SendResultEmailUseCase
    ],
})
export class PresentationModule { }
