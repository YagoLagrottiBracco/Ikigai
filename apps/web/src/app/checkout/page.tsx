'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    Star,
    Zap,
    Crown,
    Mail,
    Shield,
    FileText,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const plans = [
    {
        id: 'basic',
        name: 'Básico',
        price: 5.99,
        icon: Zap,
        color: 'var(--color-skills)',
        gradient: 'var(--gradient-skills)',
        features: [
            '1 análise completa',
            'Ranking de carreiras',
            'PDF para download',
            'Texto motivacional'
        ],
        popular: false
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 19.90,
        period: '/mês',
        icon: Star,
        color: 'var(--color-ikigai)',
        gradient: 'var(--gradient-ikigai)',
        features: [
            'Análises ilimitadas',
            'Ranking de carreiras',
            'Análise SWOT completa',
            'Plano de ação detalhado',
            'PDF + Email',
            'Suporte prioritário'
        ],
        popular: true
    },
    {
        id: 'lifetime',
        name: 'Vitalício',
        price: 49.90,
        icon: Crown,
        color: 'var(--color-paid)',
        gradient: 'var(--gradient-paid)',
        features: [
            'Acesso permanente',
            'Todas as features Premium',
            'Atualizações futuras',
            'Compartilhamento social'
        ],
        popular: false
    }
];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hash = searchParams.get('hash');

    const [selectedPlan, setSelectedPlan] = useState('basic');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!hash) {
            router.push('/questionario');
        }
    }, [hash, router]);

    const handleCheckout = async () => {
        if (!email || !email.includes('@')) {
            setError('Por favor, insira um email válido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/payments/create-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionHash: hash,
                    planId: selectedPlan,
                    email
                })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('Erro ao criar sessão de pagamento');
            }
        } catch (err) {
            console.error('Erro no checkout:', err);
            setError('Erro ao processar pagamento. Tente novamente.');
            setIsLoading(false);
        }
    };

    // For demo/test without Stripe, skip to result
    const handleDemoMode = async () => {
        if (!hash) {
            setError('Sessão não encontrada. Volte ao questionário.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Trigger analysis
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${hash}/analyze`, {
                method: 'POST'
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = Array.isArray(data.message)
                    ? data.message.join(', ')
                    : data.message || 'Erro ao processar análise';
                setError(errorMsg);
                setIsLoading(false);
                return;
            }

            router.push(`/resultado/${hash}`);
        } catch (err) {
            console.error('Erro:', err);
            setError('Erro de conexão. Verifique se a API está rodando.');
            setIsLoading(false);
        }
    };

    return (
        <main style={{
            background: 'var(--color-bg)',
            minHeight: '100vh',
            paddingTop: 'var(--space-12)',
            paddingBottom: 'var(--space-12)'
        }}>
            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{
                            position: 'fixed',
                            top: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            maxWidth: 400
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                marginLeft: 8,
                                opacity: 0.8,
                                fontSize: '1.2rem'
                            }}
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container" style={{ maxWidth: 1000 }}>
                {/* Back Button */}
                <button
                    onClick={() => router.push('/questionario')}
                    className="btn-secondary"
                    style={{
                        marginBottom: 'var(--space-6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                    }}
                >
                    <ArrowLeft size={18} />
                    Voltar ao questionário
                </button>

                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 'var(--radius-xl)',
                            background: 'var(--gradient-ikigai)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-4)'
                        }}
                    >
                        <Sparkles size={28} color="white" />
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-3)' }}>
                        Seu Ikigai está pronto!
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.125rem',
                        maxWidth: 500,
                        margin: '0 auto'
                    }}>
                        Escolha um plano para desbloquear sua análise personalizada completa
                    </p>
                </motion.div>

                {/* Plans */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ delay: 0.2 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-6)',
                        marginBottom: 'var(--space-10)'
                    }}
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            onClick={() => setSelectedPlan(plan.id)}
                            className="glass-card"
                            style={{
                                padding: 'var(--space-6)',
                                cursor: 'pointer',
                                position: 'relative',
                                border: selectedPlan === plan.id
                                    ? `2px solid ${plan.color}`
                                    : '1px solid var(--color-border)',
                                transform: selectedPlan === plan.id ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {plan.popular && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: plan.gradient,
                                        padding: 'var(--space-1) var(--space-3)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'white'
                                    }}
                                >
                                    MAIS POPULAR
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                marginBottom: 'var(--space-4)'
                            }}>
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        background: plan.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <plan.icon size={24} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: plan.color }}>{plan.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                                            R$ {plan.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {plan.period && (
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-2)',
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-secondary)'
                                        }}
                                    >
                                        <Check size={16} color={plan.color} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Selection indicator */}
                            {selectedPlan === plan.id && (
                                <motion.div
                                    layoutId="selection"
                                    style={{
                                        position: 'absolute',
                                        top: 'var(--space-4)',
                                        right: 'var(--space-4)',
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: plan.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Check size={14} color="white" />
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Email + Checkout */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ delay: 0.5 }}
                    className="glass-card"
                    style={{
                        padding: 'var(--space-8)',
                        maxWidth: 500,
                        margin: '0 auto'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <Mail size={20} color="var(--color-ikigai)" />
                        <h4 style={{ margin: 0 }}>Onde enviar sua análise?</h4>
                    </div>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="input-premium"
                        style={{ marginBottom: 'var(--space-4)' }}
                    />

                    {error && (
                        <p style={{
                            color: 'var(--color-love)',
                            fontSize: '0.875rem',
                            marginBottom: 'var(--space-4)'
                        }}>
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={isLoading || !email}
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: 'var(--space-4)',
                            fontSize: '1.1rem',
                            opacity: isLoading || !email ? 0.7 : 1
                        }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin-slow" />
                                Processando...
                            </>
                        ) : (
                            <>
                                Pagar e Desbloquear
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    {/* Demo mode button */}
                    <button
                        onClick={handleDemoMode}
                        disabled={isLoading}
                        className="btn-secondary"
                        style={{
                            width: '100%',
                            marginTop: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            fontSize: '0.9rem'
                        }}
                    >
                        🧪 Testar sem pagamento (demo)
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-4)',
                        marginTop: 'var(--space-4)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            <Shield size={14} />
                            Pagamento seguro
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            <FileText size={14} />
                            PDF no email
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg)'
            }}>
                <Loader2 size={32} className="animate-spin-slow" color="var(--color-ikigai)" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
