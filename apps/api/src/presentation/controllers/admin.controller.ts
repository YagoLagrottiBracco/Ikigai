import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument } from '../../infrastructure/database/schemas/session.schema';

@Controller('admin')
export class AdminController {
    constructor(
        @InjectModel(SessionDocument.name)
        private readonly sessionModel: Model<SessionDocument>
    ) { }

    @Get('stats')
    async getStats(@Query('period') period: string = '7d') {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'all':
                startDate = new Date(0);
                break;
            default: // 7d
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const dateQuery = { createdAt: { $gte: startDate } };

        // Total sessions
        const totalSessions = await this.sessionModel.countDocuments(dateQuery);

        // Analyzed sessions
        const totalAnalyzed = await this.sessionModel.countDocuments({
            ...dateQuery,
            status: 'analyzed'
        });

        // Sessions with email (paid assumed)
        const paidSessions = await this.sessionModel.countDocuments({
            ...dateQuery,
            'payments.0': { $exists: true }
        });

        // Calculate revenue (basic estimation)
        const basicPrice = 5.99;
        const totalRevenue = paidSessions * basicPrice;

        // Get previous period for comparison
        const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
        const previousPaidSessions = await this.sessionModel.countDocuments({
            createdAt: { $gte: previousStartDate, $lt: startDate },
            'payments.0': { $exists: true }
        });
        const previousRevenue = previousPaidSessions * basicPrice;
        const revenueChange = previousRevenue > 0
            ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        // Get recent sessions
        const sessions = await this.sessionModel
            .find(dateQuery)
            .sort({ createdAt: -1 })
            .limit(20)
            .select('hash context.name context.email status payments createdAt analyzedAt')
            .lean();

        const sessionSummaries = sessions.map((s: any) => ({
            hash: s.hash,
            name: s.context?.name || 'Sem nome',
            email: s.context?.email,
            status: s.status,
            plan: s.payments?.[0]?.plan,
            createdAt: s.createdAt,
            analyzedAt: s.analyzedAt
        }));

        return {
            stats: {
                totalSessions,
                totalAnalyzed,
                totalRevenue,
                emailsSent: totalAnalyzed, // Assuming email sent = analyzed
                conversionRate: totalSessions > 0
                    ? (totalAnalyzed / totalSessions) * 100
                    : 0,
                revenueChange
            },
            sessions: sessionSummaries
        };
    }
}
