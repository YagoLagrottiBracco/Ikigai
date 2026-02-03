import { Controller, Post, Body, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from '../../infrastructure/external/stripe/stripe.service';
import { AnalyzeSessionUseCase } from '../../application/use-cases/analyze-session.use-case';

interface CreateCheckoutDto {
    sessionHash: string;
    planId: string;
    email: string;
}

@Controller('payments')
export class PaymentController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly analyzeSessionUseCase: AnalyzeSessionUseCase
    ) { }

    @Post('create-checkout')
    async createCheckout(@Body() dto: CreateCheckoutDto) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        const url = await this.stripeService.createCheckoutSession({
            sessionHash: dto.sessionHash,
            planId: dto.planId,
            email: dto.email,
            successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&hash=${dto.sessionHash}`,
            cancelUrl: `${baseUrl}/checkout?hash=${dto.sessionHash}`
        });

        return { url };
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string
    ) {
        try {
            const event = await this.stripeService.verifyWebhook(
                req.rawBody as Buffer,
                signature
            );

            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object as any;
                    const { sessionHash } = session.metadata || {};

                    if (sessionHash) {
                        // Trigger AI analysis after payment
                        await this.analyzeSessionUseCase.execute(sessionHash);
                    }
                    break;
            }

            return { received: true };
        } catch (error) {
            console.error('Webhook error:', error);
            throw error;
        }
    }

    @Post('verify')
    async verifyPayment(@Body() body: { sessionId: string }) {
        const session = await this.stripeService.getSessionById(body.sessionId);
        return {
            paid: session.payment_status === 'paid',
            sessionHash: session.metadata?.sessionHash
        };
    }
}
