'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, Lightbulb, Globe, Coins, Sparkles, CheckCircle, ChevronDown, Star, Zap, Mail, Shield } from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ikigaiCircles = [
    { icon: Heart, label: 'O que você ama', color: 'var(--color-love)', gradient: 'var(--gradient-love)' },
    { icon: Lightbulb, label: 'O que você é bom', color: 'var(--color-skills)', gradient: 'var(--gradient-skills)' },
    { icon: Globe, label: 'O que o mundo precisa', color: 'var(--color-world)', gradient: 'var(--gradient-world)' },
    { icon: Coins, label: 'Pelo que pode ser pago', color: 'var(--color-paid)', gradient: 'var(--gradient-paid)' },
];

const features = [
    {
        icon: Zap,
        title: 'Análise por IA Avançada',
        description: 'Nossa IA analisa profundamente suas respostas e encontra padrões únicos do seu perfil.'
    },
    {
        icon: Star,
        title: 'Ranking de Carreiras',
        description: 'Receba até 5 carreiras sugeridas com % de compatibilidade e passos práticos.'
    },
    {
        icon: Mail,
        title: 'PDF + Email',
        description: 'Receba sua análise completa no email com um PDF profissional para guardar.'
    },
    {
        icon: Shield,
        title: 'Análise SWOT Pessoal',
        description: 'Descubra seus pontos fortes, fracos, oportunidades e ameaças na carreira.'
    }
];

const testimonials = [
    {
        name: 'Marina Costa',
        role: 'Designer UX',
        content: 'O Ikigai me ajudou a entender porque eu amava algumas tarefas e odiava outras. Mudei de carreira e hoje sou muito mais feliz!',
        avatar: '👩‍🎨'
    },
    {
        name: 'Carlos Eduardo',
        role: 'Desenvolvedor',
        content: 'A análise foi surpreendentemente precisa. As sugestões de carreira fizeram total sentido com meu perfil.',
        avatar: '👨‍💻'
    },
    {
        name: 'Ana Paula',
        role: 'Engenheira',
        content: 'Estava perdida na carreira. O plano de ação me deu clareza e direção. Recomendo muito!',
        avatar: '👩‍🔬'
    }
];

const faqs = [
    {
        question: 'O que é o Ikigai?',
        answer: 'Ikigai é um conceito japonês que significa "razão de viver". É a interseção entre o que você ama, o que você é bom, o que o mundo precisa e pelo que você pode ser pago. Quando esses 4 elementos se alinham, você encontra seu propósito.'
    },
    {
        question: 'Como funciona a análise?',
        answer: 'Você responde um questionário sobre seus interesses, habilidades e valores. Nossa IA avançada analisa suas respostas e gera um relatório personalizado com sugestões de carreira, análise SWOT e um plano de ação prático.'
    },
    {
        question: 'Quanto custa?',
        answer: 'O valor é único de R$ 5,99 por análise. Você recebe sua análise completa no email com um PDF profissional. Também temos planos Premium e Vitalício para quem quer fazer múltiplas análises.'
    },
    {
        question: 'A análise é confiável?',
        answer: 'Nossa IA foi treinada com base em metodologias de orientação vocacional e coaching de carreira. Ela considera padrões e conexões entre suas respostas para gerar insights valiosos e acionáveis.'
    }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="glass-card overflow-hidden"
            initial={false}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
                <span className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} style={{ color: 'var(--color-text-muted)' }} />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
            >
                <p className="px-6 pb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {answer}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function HomePage() {
    return (
        <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section
                className="section"
                style={{
                    background: 'var(--gradient-hero)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Floating Circles Background */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    <motion.div
                        className="animate-float"
                        style={{
                            position: 'absolute',
                            top: '10%',
                            left: '10%',
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'var(--color-love)',
                            opacity: 0.05,
                            filter: 'blur(80px)'
                        }}
                    />
                    <motion.div
                        className="animate-float"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10%',
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background: 'var(--color-skills)',
                            opacity: 0.05,
                            filter: 'blur(100px)',
                            animationDelay: '1s'
                        }}
                    />
                    <motion.div
                        className="animate-float"
                        style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '30%',
                            width: 350,
                            height: 350,
                            borderRadius: '50%',
                            background: 'var(--color-ikigai)',
                            opacity: 0.05,
                            filter: 'blur(90px)',
                            animationDelay: '2s'
                        }}
                    />
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            paddingTop: 'var(--space-16)',
                            paddingBottom: 'var(--space-8)'
                        }}
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeUp}
                            className="glass-card"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                padding: 'var(--space-2) var(--space-4)',
                                marginBottom: 'var(--space-6)',
                                borderRadius: 'var(--radius-full)'
                            }}
                        >
                            <Sparkles size={16} style={{ color: 'var(--color-ikigai)' }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                                Análise por IA Avançada
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeUp}
                            style={{
                                maxWidth: 800,
                                marginBottom: 'var(--space-6)',
                                lineHeight: 1.1
                            }}
                        >
                            Descubra seu{' '}
                            <span className="text-gradient">Ikigai</span>
                            <br />
                            e encontre seu propósito
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={fadeUp}
                            style={{
                                maxWidth: 600,
                                fontSize: '1.25rem',
                                marginBottom: 'var(--space-8)',
                                color: 'var(--color-text-secondary)'
                            }}
                        >
                            Responda algumas perguntas e nossa IA vai revelar sua combinação única de
                            paixão, talento, missão e profissão.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeUp}
                            style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}
                        >
                            <Link href="/questionario">
                                <button className="btn-primary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: '1.1rem' }}>
                                    Descobrir meu Ikigai
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                            <a href="#como-funciona">
                                <button className="btn-secondary" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: '1.1rem' }}>
                                    Como funciona
                                </button>
                            </a>
                        </motion.div>

                        {/* Price Badge */}
                        <motion.p
                            variants={fadeUp}
                            style={{
                                marginTop: 'var(--space-6)',
                                fontSize: '0.875rem',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            💰 Apenas <strong style={{ color: 'var(--color-paid)' }}>R$ 5,99</strong> por análise completa
                        </motion.p>
                    </motion.div>

                    {/* Ikigai Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: 'var(--space-8)'
                        }}
                    >
                        <div style={{ position: 'relative', width: 400, height: 400 }}>
                            {ikigaiCircles.map((circle, index) => {
                                const positions = [
                                    { top: '0%', left: '25%' },
                                    { top: '25%', left: '50%' },
                                    { top: '50%', left: '25%' },
                                    { top: '25%', left: '0%' }
                                ];
                                const pos = positions[index];
                                return (
                                    <motion.div
                                        key={circle.label}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 0.7, scale: 1 }}
                                        transition={{ delay: 0.8 + index * 0.15, type: 'spring' }}
                                        style={{
                                            position: 'absolute',
                                            ...pos,
                                            width: 200,
                                            height: 200,
                                            borderRadius: '50%',
                                            background: circle.gradient,
                                            filter: 'blur(2px)',
                                            mixBlendMode: 'screen'
                                        }}
                                    />
                                );
                            })}
                            {/* Center - Ikigai */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.4, type: 'spring' }}
                                className="animate-glow"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    background: 'var(--gradient-ikigai)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-glow-ikigai)'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>IKIGAI</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What is Ikigai */}
            <section id="como-funciona" className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
                    >
                        <motion.h2 variants={fadeUp} style={{ marginBottom: 'var(--space-4)' }}>
                            O que é <span className="text-gradient">Ikigai</span>?
                        </motion.h2>
                        <motion.p variants={fadeUp} style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.125rem' }}>
                            Ikigai (生き甲斐) é um conceito japonês que significa "razão de viver".
                            É a interseção perfeita de 4 elementos fundamentais da sua vida.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'var(--space-6)'
                        }}
                    >
                        {ikigaiCircles.map((item, index) => (
                            <motion.div
                                key={item.label}
                                variants={fadeUp}
                                className="glass-card"
                                style={{ padding: 'var(--space-6)', textAlign: 'center' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 'var(--radius-xl)',
                                        background: item.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto var(--space-4)',
                                        boxShadow: `0 8px 30px ${item.color}40`
                                    }}
                                >
                                    <item.icon size={28} color="white" />
                                </div>
                                <h4 style={{ marginBottom: 'var(--space-2)', color: item.color }}>
                                    {item.label}
                                </h4>
                                <p style={{ fontSize: '0.95rem' }}>
                                    {index === 0 && 'Suas paixões, hobbies e o que te faz sentir vivo.'}
                                    {index === 1 && 'Suas habilidades naturais e talentos desenvolvidos.'}
                                    {index === 2 && 'Causas e problemas que você quer ajudar a resolver.'}
                                    {index === 3 && 'Formas de monetizar suas habilidades e paixões.'}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
                    >
                        <motion.h2 variants={fadeUp} style={{ marginBottom: 'var(--space-4)' }}>
                            O que você vai receber
                        </motion.h2>
                        <motion.p variants={fadeUp} style={{ maxWidth: 600, margin: '0 auto', fontSize: '1.125rem' }}>
                            Uma análise completa e personalizada do seu perfil
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'var(--space-6)'
                        }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                className="glass-card"
                                style={{ padding: 'var(--space-6)' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--gradient-ikigai)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 'var(--space-4)'
                                    }}
                                >
                                    <feature.icon size={24} color="white" />
                                </div>
                                <h4 style={{ marginBottom: 'var(--space-2)' }}>{feature.title}</h4>
                                <p style={{ fontSize: '0.95rem' }}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
                    >
                        <motion.h2 variants={fadeUp} style={{ marginBottom: 'var(--space-4)' }}>
                            O que dizem sobre nós
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: 'var(--space-6)'
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.name}
                                variants={fadeUp}
                                className="glass-card"
                                style={{ padding: 'var(--space-6)' }}
                            >
                                <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="var(--color-paid)" color="var(--color-paid)" />
                                    ))}
                                </div>
                                <p style={{ marginBottom: 'var(--space-4)', fontStyle: 'italic' }}>
                                    "{testimonial.content}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '2rem' }}>{testimonial.avatar}</span>
                                    <div>
                                        <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 0 }}>
                                            {testimonial.name}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
                    >
                        <motion.h2 variants={fadeUp} style={{ marginBottom: 'var(--space-4)' }}>
                            Perguntas Frequentes
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
                    >
                        {faqs.map((faq) => (
                            <motion.div key={faq.question} variants={fadeUp}>
                                <FAQItem question={faq.question} answer={faq.answer} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="glass-card"
                        style={{
                            padding: 'var(--space-12)',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)'
                        }}
                    >
                        <motion.h2 variants={fadeUp} style={{ marginBottom: 'var(--space-4)' }}>
                            Pronto para descobrir seu propósito?
                        </motion.h2>
                        <motion.p variants={fadeUp} style={{ marginBottom: 'var(--space-6)', maxWidth: 600, margin: '0 auto var(--space-6)' }}>
                            Responda o questionário em poucos minutos e receba sua análise personalizada.
                        </motion.p>
                        <motion.div variants={fadeUp}>
                            <Link href="/questionario">
                                <button className="btn-primary" style={{ padding: 'var(--space-4) var(--space-10)', fontSize: '1.1rem' }}>
                                    Começar agora
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                        </motion.div>
                        <motion.p
                            variants={fadeUp}
                            style={{ marginTop: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}
                        >
                            <CheckCircle size={16} style={{ display: 'inline', marginRight: 'var(--space-2)', color: 'var(--color-world)' }} />
                            Pagamento único • Análise completa • PDF no email
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} Florir. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </main>
    );
}
