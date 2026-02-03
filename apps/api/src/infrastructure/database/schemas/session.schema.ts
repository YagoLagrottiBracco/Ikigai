import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LifeStage, SessionStatus } from '@ikigai/shared';

@Schema({ _id: false })
class ContextSchema {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    currentProfession: string;

    @Prop()
    educationArea: string;

    @Prop({ required: true, enum: ['student', 'employed', 'unemployed', 'transition', 'retired'] })
    lifeStage: LifeStage;

    @Prop()
    currentSituation: string;
}

@Schema({ _id: false })
class AnswersSchema {
    @Prop({ type: [String], default: [] })
    love: string[];

    @Prop({ type: [String], default: [] })
    skills: string[];

    @Prop({ type: [String], default: [] })
    worldNeeds: string[];

    @Prop({ type: [String], default: [] })
    paidFor: string[];
}

@Schema({ _id: false })
class AIAnalysisSchema {
    @Prop()
    profileSummary: string;

    @Prop({ type: [String], default: [] })
    suggestedCareers: string[];

    @Prop({ type: [String], default: [] })
    identifiedGaps: string[];

    @Prop()
    actionPlan: string;

    @Prop()
    currentSituationAnalysis: string;

    @Prop({ type: Date, default: Date.now })
    generatedAt: Date;
}

@Schema({ timestamps: true, collection: 'ikigai_sessions' })
export class SessionDocument extends Document {
    @Prop({ required: true, unique: true, index: true })
    hash: string;

    @Prop({ type: ContextSchema, required: true })
    context: ContextSchema;

    @Prop({ type: AnswersSchema, default: {} })
    answers: AnswersSchema;

    @Prop({ type: AIAnalysisSchema, default: null })
    aiAnalysis: AIAnalysisSchema | null;

    @Prop({
        required: true,
        enum: ['in_progress', 'completed', 'analyzed'],
        default: 'in_progress'
    })
    status: SessionStatus;

    createdAt: Date;
    updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionDocument);
