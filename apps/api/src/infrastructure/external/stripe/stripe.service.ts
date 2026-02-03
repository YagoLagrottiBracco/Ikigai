import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

export interface CreateCheckoutSessionParams {
    sessionHash: string;
    planId: string;
    email: string;
    successUrl: string;
    cancelUrl: string;
}

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private prices: Record<string, number>;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
            console.warn('STRIPE_SECRET_KEY não configurada - modo demo ativo');
        }

        this.stripe = new Stripe(secretKey || 'sk_test_demo');

        this.prices = {
            basic: this.configService.get<number>('PRICE_BASIC', 599),
            premium: this.configService.get<number>('PRICE_PREMIUM', 1990),
            lifetime: this.configService.get<number>('PRICE_LIFETIME', 4990)
        };
    }

    async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
        const { sessionHash, planId, email, successUrl, cancelUrl } = params;

        const price = this.prices[planId] || this.prices.basic;
        const planNames: Record<string, string> = {
            basic: 'Ikigai - Análise Básica',
            premium: 'Ikigai - Premium Mensal',
            lifetime: 'Ikigai - Acesso Vitalício'
        };

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: planNames[planId] || planNames.basic,
                            description: 'Análise personalizada do seu Ikigai com IA'
                        },
                        unit_amount: price,
                        ...(planId === 'premium' ? { recurring: { interval: 'month' } } : {})
                    },
                    quantity: 1
                }
            ],
            mode: planId === 'premium' ? 'subscription' : 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: email,
            metadata: {
                sessionHash,
                planId
            }
        });

        return session.url || '';
    }

    async verifyWebhook(payload: Buffer, signature: string): Promise<Stripe.Event> {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET', '');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }

    async getSessionById(sessionId: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
}

export const STRIPE_SERVICE = Symbol('StripeService');
