import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import {
    CreateSessionUseCase,
    GetSessionUseCase,
    UpdateAnswersUseCase,
    AnalyzeSessionUseCase,
    GeneratePdfUseCase,
    SendResultEmailUseCase,
} from './use-cases';

@Module({
    imports: [InfrastructureModule],
    providers: [
        CreateSessionUseCase,
        GetSessionUseCase,
        UpdateAnswersUseCase,
        AnalyzeSessionUseCase,
        GeneratePdfUseCase,
        SendResultEmailUseCase,
    ],
    exports: [
        CreateSessionUseCase,
        GetSessionUseCase,
        UpdateAnswersUseCase,
        AnalyzeSessionUseCase,
        GeneratePdfUseCase,
        SendResultEmailUseCase,
    ],
})
export class ApplicationModule { }
