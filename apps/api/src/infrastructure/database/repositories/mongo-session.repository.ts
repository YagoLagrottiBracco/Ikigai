import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISessionRepository } from '../../../domain/repositories/session.repository';
import { IkigaiSessionEntity } from '../../../domain/entities/ikigai-session.entity';
import { SessionDocument } from '../schemas/session.schema';

@Injectable()
export class MongoSessionRepository implements ISessionRepository {
    constructor(
        @InjectModel(SessionDocument.name)
        private readonly sessionModel: Model<SessionDocument>,
    ) { }

    async create(session: IkigaiSessionEntity): Promise<IkigaiSessionEntity> {
        const plainSession = session.toPlainObject();

        const doc = new this.sessionModel({
            hash: plainSession.hash,
            context: plainSession.context,
            answers: plainSession.answers,
            status: plainSession.status,
            aiAnalysis: null,
        });

        const saved = await doc.save();

        return IkigaiSessionEntity.fromPlainObject({
            id: saved._id.toString(),
            hash: saved.hash,
            context: saved.context,
            answers: saved.answers,
            status: saved.status,
            aiAnalysis: saved.aiAnalysis,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        });
    }

    async findByHash(hash: string): Promise<IkigaiSessionEntity | null> {
        const doc = await this.sessionModel.findOne({ hash }).exec();

        if (!doc) {
            return null;
        }

        return IkigaiSessionEntity.fromPlainObject({
            id: doc._id.toString(),
            hash: doc.hash,
            context: doc.context,
            answers: doc.answers,
            status: doc.status,
            aiAnalysis: doc.aiAnalysis,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    async update(session: IkigaiSessionEntity): Promise<IkigaiSessionEntity> {
        const plainSession = session.toPlainObject();

        const updated = await this.sessionModel.findOneAndUpdate(
            { hash: session.hash },
            {
                answers: plainSession.answers,
                status: plainSession.status,
                aiAnalysis: plainSession.aiAnalysis,
            },
            { new: true }
        ).exec();

        if (!updated) {
            throw new Error('Sessão não encontrada para atualização');
        }

        return IkigaiSessionEntity.fromPlainObject({
            id: updated._id.toString(),
            hash: updated.hash,
            context: updated.context,
            answers: updated.answers,
            status: updated.status,
            aiAnalysis: updated.aiAnalysis,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        });
    }

    async hashExists(hash: string): Promise<boolean> {
        const count = await this.sessionModel.countDocuments({ hash }).exec();
        return count > 0;
    }
}
