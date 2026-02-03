'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IkigaiContext, IkigaiAnswers, LifeStage, LIFE_STAGE_LABELS } from '@ikigai/shared';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    User,
    Heart,
    Lightbulb,
    Globe,
    Coins,
    CheckCircle,
    Sparkles
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const steps = [
    { id: 'context', label: 'Sobre você', icon: User, color: 'var(--color-text-primary)' },
    { id: 'love', label: 'O que ama', icon: Heart, color: 'var(--color-love)' },
    { id: 'skills', label: 'Habilidades', icon: Lightbulb, color: 'var(--color-skills)' },
    { id: 'worldNeeds', label: 'Mundo precisa', icon: Globe, color: 'var(--color-world)' },
    { id: 'paidFor', label: 'Ser pago', icon: Coins, color: 'var(--color-paid)' }
];

const ikigaiQuestions = {
    love: {
        title: 'O que você ama fazer?',
        subtitle: 'Atividades que te fazem perder a noção do tempo',
        placeholder: 'Ex: Ensinar, criar coisas, resolver problemas...',
        tips: [
            'O que você faria mesmo sem receber nada?',
            'Quais hobbies te fazem esquecer do mundo?',
            'O que te deixa animado só de pensar?'
        ]
    },
    skills: {
        title: 'O que você é bom fazendo?',
        subtitle: 'Habilidades naturais ou desenvolvidas',
        placeholder: 'Ex: Comunicação, programação, liderança...',
        tips: [
            'Pelo que as pessoas te elogiam?',
            'O que você faz melhor que a maioria?',
            'Quais conhecimentos você domina?'
        ]
    },
    worldNeeds: {
        title: 'O que o mundo precisa?',
        subtitle: 'Problemas que você gostaria de resolver',
        placeholder: 'Ex: Educação de qualidade, saúde mental...',
        tips: [
            'Que causa social te importa?',
            'Que problemas você gostaria de resolver?',
            'Como você pode contribuir para o mundo?'
        ]
    },
    paidFor: {
        title: 'Pelo que você pode ser pago?',
        subtitle: 'Formas de monetizar seus talentos',
        placeholder: 'Ex: Consultoria, freelance, cursos...',
        tips: [
            'Por quais serviços pessoas pagariam você?',
            'Quais habilidades têm demanda no mercado?',
            'Como transformar sua paixão em renda?'
        ]
    }
};

interface TagInputProps {
    items: string[];
    onAdd: (item: string) => void;
    onRemove: (index: number) => void;
    placeholder: string;
    color: string;
}

function TagInput({ items, onAdd, onRemove, placeholder, color }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim() && items.length < 10) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="input-premium"
                    style={{ flex: 1 }}
                />
                <button
                    onClick={handleAdd}
                    disabled={!inputValue.trim() || items.length >= 10}
                    className="btn-primary"
                    style={{
                        opacity: !inputValue.trim() || items.length >= 10 ? 0.5 : 1,
                        cursor: !inputValue.trim() || items.length >= 10 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Adicionar
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-2)',
                minHeight: 40
            }}>
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        <motion.span
                            key={`${index}-${item}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                            className="tag"
                            style={{
                                borderColor: color,
                                color: color,
                                paddingRight: 'var(--space-2)'
                            }}
                        >
                            {item}
                            <button
                                onClick={() => onRemove(index)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    marginLeft: 'var(--space-2)',
                                    color: color,
                                    opacity: 0.7,
                                    fontSize: '1rem',
                                    lineHeight: 1
                                }}
                            >
                                ×
                            </button>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            <p style={{
                marginTop: 'var(--space-3)',
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)'
            }}>
                {items.length}/10 respostas • Adicione pelo menos 3
            </p>
        </div>
    );
}

export default function QuestionarioPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [context, setContext] = useState<IkigaiContext>({
        name: '',
        age: 0,
        currentProfession: '',
        educationArea: '',
        lifeStage: 'transition',
        currentSituation: ''
    });

    const [answers, setAnswers] = useState<IkigaiAnswers>({
        love: [],
        skills: [],
        worldNeeds: [],
        paidFor: []
    });

    const updateContext = (field: keyof IkigaiContext, value: string | number) => {
        setContext((prev) => ({ ...prev, [field]: value }));
    };

    const addAnswer = (category: keyof IkigaiAnswers, item: string) => {
        setAnswers((prev) => ({
            ...prev,
            [category]: [...prev[category], item]
        }));
    };

    const removeAnswer = (category: keyof IkigaiAnswers, index: number) => {
        setAnswers((prev) => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            return context.name && context.age > 0 && context.currentProfession && context.lifeStage;
        }
        const categories = ['love', 'skills', 'worldNeeds', 'paidFor'] as const;
        const category = categories[currentStep - 1];
        return answers[category].length >= 3;
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Submit
            setIsSubmitting(true);
            try {
                console.log('Enviando contexto:', context);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(context)
                });

                const data = await response.json();
                console.log('Resposta da API:', data);

                if (!response.ok) {
                    console.error('Erro HTTP:', response.status, data);
                    const errorMsg = Array.isArray(data.message)
                        ? data.message.join(', ')
                        : data.message || 'Erro ao criar sessão';
                    throw new Error(errorMsg);
                }

                // Verifica se hash existe na resposta
                if (!data.hash) {
                    console.error('Resposta sem hash:', data);
                    throw new Error('Hash não retornado');
                }

                // Update answers
                const answersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${data.hash}/answers`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(answers) // Envia answers diretamente, não aninhado
                });

                if (!answersResponse.ok) {
                    console.error('Erro ao salvar respostas:', await answersResponse.json());
                }

                // Redirect to checkout
                router.push(`/checkout?hash=${data.hash}`);
            } catch (err: unknown) {
                console.error('Erro ao criar sessão:', err);
                const errorMessage = err instanceof Error ? err.message : 'Erro ao criar sessão';
                setError(errorMessage);
                setIsSubmitting(false);

                // Auto-hide error after 5 seconds
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <main style={{
            background: 'var(--color-bg)',
            minHeight: '100vh',
            paddingTop: 'var(--space-8)',
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

            <div className="container" style={{ maxWidth: 700 }}>
                {/* Progress Header */}
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    {/* Step indicators */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                animate={{
                                    scale: index === currentStep ? 1.1 : 1,
                                    opacity: index <= currentStep ? 1 : 0.4
                                }}
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 'var(--radius-lg)',
                                    background: index < currentStep
                                        ? step.color
                                        : index === currentStep
                                            ? 'var(--color-surface)'
                                            : 'var(--color-bg-tertiary)',
                                    border: index === currentStep
                                        ? `2px solid ${step.color}`
                                        : '2px solid transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {index < currentStep ? (
                                    <CheckCircle size={20} color="white" />
                                ) : (
                                    <step.icon
                                        size={20}
                                        color={index === currentStep ? step.color : 'var(--color-text-muted)'}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="progress-bar">
                        <motion.div
                            className="progress-bar-fill"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="glass-card"
                        style={{ padding: 'var(--space-8)' }}
                    >
                        {/* Step 0: Context */}
                        {currentStep === 0 && (
                            <div>
                                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
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
                                        <User size={28} color="white" />
                                    </div>
                                    <h2 style={{ marginBottom: 'var(--space-2)' }}>Vamos nos conhecer</h2>
                                    <p style={{ color: 'var(--color-text-secondary)' }}>
                                        Conte um pouco sobre você para personalizarmos sua análise
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: 'var(--space-2)',
                                            fontWeight: 500
                                        }}>
                                            Qual seu nome?
                                        </label>
                                        <input
                                            type="text"
                                            value={context.name}
                                            onChange={(e) => updateContext('name', e.target.value)}
                                            placeholder="Seu nome"
                                            className="input-premium"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: 'var(--space-2)',
                                                fontWeight: 500
                                            }}>
                                                Idade
                                            </label>
                                            <input
                                                type="number"
                                                value={context.age || ''}
                                                onChange={(e) => updateContext('age', parseInt(e.target.value) || 0)}
                                                placeholder="25"
                                                className="input-premium"
                                            />
                                        </div>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                marginBottom: 'var(--space-2)',
                                                fontWeight: 500
                                            }}>
                                                Profissão atual
                                            </label>
                                            <input
                                                type="text"
                                                value={context.currentProfession}
                                                onChange={(e) => updateContext('currentProfession', e.target.value)}
                                                placeholder="Ex: Analista"
                                                className="input-premium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: 'var(--space-2)',
                                            fontWeight: 500
                                        }}>
                                            Área de formação (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={context.educationArea || ''}
                                            onChange={(e) => updateContext('educationArea', e.target.value)}
                                            placeholder="Ex: Engenharia, Administração..."
                                            className="input-premium"
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: 'var(--space-2)',
                                            fontWeight: 500
                                        }}>
                                            Momento de vida
                                        </label>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                            gap: 'var(--space-2)'
                                        }}>
                                            {(Object.entries(LIFE_STAGE_LABELS) as [LifeStage, string][]).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => updateContext('lifeStage', key)}
                                                    style={{
                                                        padding: 'var(--space-3)',
                                                        borderRadius: 'var(--radius-lg)',
                                                        border: context.lifeStage === key
                                                            ? '2px solid var(--color-ikigai)'
                                                            : '1px solid var(--color-border)',
                                                        background: context.lifeStage === key
                                                            ? 'rgba(157, 78, 221, 0.1)'
                                                            : 'var(--color-surface)',
                                                        color: context.lifeStage === key
                                                            ? 'var(--color-ikigai)'
                                                            : 'var(--color-text-secondary)',
                                                        cursor: 'pointer',
                                                        fontWeight: context.lifeStage === key ? 600 : 400,
                                                        transition: 'all 0.2s ease',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: 'var(--space-2)',
                                            fontWeight: 500
                                        }}>
                                            Descreva sua situação atual (opcional)
                                        </label>
                                        <textarea
                                            value={context.currentSituation || ''}
                                            onChange={(e) => updateContext('currentSituation', e.target.value)}
                                            placeholder="Ex: Estou insatisfeito com meu emprego atual e buscando uma mudança..."
                                            className="input-premium"
                                            rows={3}
                                            style={{ resize: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Steps 1-4: Ikigai Questions */}
                        {currentStep > 0 && currentStep <= 4 && (
                            () => {
                                const categories = ['love', 'skills', 'worldNeeds', 'paidFor'] as const;
                                const category = categories[currentStep - 1];
                                const question = ikigaiQuestions[category];
                                const step = steps[currentStep];

                                return (
                                    <div>
                                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                            <div
                                                style={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 'var(--radius-xl)',
                                                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto var(--space-4)',
                                                    boxShadow: `0 8px 30px ${step.color}40`
                                                }}
                                            >
                                                <step.icon size={28} color="white" />
                                            </div>
                                            <h2 style={{ marginBottom: 'var(--space-2)', color: step.color }}>
                                                {question.title}
                                            </h2>
                                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                                {question.subtitle}
                                            </p>
                                        </div>

                                        {/* Tips */}
                                        <div
                                            className="glass-card"
                                            style={{
                                                padding: 'var(--space-4)',
                                                marginBottom: 'var(--space-6)',
                                                borderColor: `${step.color}30`
                                            }}
                                        >
                                            <p style={{
                                                fontWeight: 600,
                                                marginBottom: 'var(--space-2)',
                                                color: step.color,
                                                fontSize: '0.9rem'
                                            }}>
                                                <Sparkles size={14} style={{ display: 'inline', marginRight: 'var(--space-2)' }} />
                                                Dicas para te ajudar:
                                            </p>
                                            <ul style={{
                                                listStyle: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 'var(--space-1)',
                                                margin: 0,
                                                padding: 0
                                            }}>
                                                {question.tips.map((tip, i) => (
                                                    <li
                                                        key={i}
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            color: 'var(--color-text-secondary)',
                                                            paddingLeft: 'var(--space-3)'
                                                        }}
                                                    >
                                                        • {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <TagInput
                                            items={answers[category]}
                                            onAdd={(item) => addAnswer(category, item)}
                                            onRemove={(index) => removeAnswer(category, index)}
                                            placeholder={question.placeholder}
                                            color={step.color}
                                        />
                                    </div>
                                );
                            }
                        )()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'var(--space-6)'
                }}>
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="btn-secondary"
                        style={{
                            opacity: currentStep === 0 ? 0.5 : 1,
                            visibility: currentStep === 0 ? 'hidden' : 'visible'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Voltar
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting}
                        className="btn-primary"
                        style={{
                            opacity: !isStepValid() || isSubmitting ? 0.5 : 1,
                            cursor: !isStepValid() || isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-pulse">Processando...</span>
                            </>
                        ) : currentStep === steps.length - 1 ? (
                            <>
                                Finalizar
                                <CheckCircle size={18} />
                            </>
                        ) : (
                            <>
                                Próximo
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
