'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lightbulb, Globe, Coins, ArrowLeft, ArrowRight } from 'lucide-react';
import { IkigaiAnswers } from '@ikigai/shared';
import { Button } from '../atoms';
import { TagInput, QuestionCard, ProgressBar, StepIndicator } from '../molecules';
import { cn } from '@/lib/utils';

interface QuestionnaireStepProps {
    currentStep: number;
    answers: IkigaiAnswers;
    onAnswersChange: (answers: Partial<IkigaiAnswers>) => void;
    onNext: () => void;
    onBack: () => void;
    onComplete: () => void;
    isLoading?: boolean;
    className?: string;
}

const steps = [
    {
        id: 'love',
        key: 'love' as keyof IkigaiAnswers,
        label: 'Ama',
        title: 'O que você AMA fazer?',
        description: 'Pense nas atividades que te fazem perder a noção do tempo, que te energizam e trazem alegria genuína.',
        icon: Heart,
        color: '#E57373',
        questions: [
            'Quais atividades fazem você perder a noção do tempo?',
            'O que você faria todos os dias mesmo sem receber nada?',
            'Quais são seus hobbies e interesses que te energizam?',
            'Sobre quais assuntos você adora conversar ou aprender?',
            'O que te fazia feliz quando era criança e ainda te atrai?',
            'Se pudesse fazer qualquer coisa amanhã, o que seria?',
        ],
    },
    {
        id: 'skills',
        key: 'skills' as keyof IkigaiAnswers,
        label: 'É bom',
        title: 'O que você é BOM fazendo?',
        description: 'Reflita sobre suas habilidades naturais, talentos desenvolvidos e competências reconhecidas.',
        icon: Lightbulb,
        color: '#64B5F6',
        questions: [
            'Quais habilidades as pessoas elogiam em você?',
            'O que você aprendeu com facilidade ao longo da vida?',
            'Em quais tarefas as pessoas costumam pedir sua ajuda?',
            'Quais são suas formações, cursos ou especializações?',
            'O que você consegue ensinar outras pessoas com confiança?',
            'Quais resultados concretos você já alcançou?',
        ],
    },
    {
        id: 'worldNeeds',
        key: 'worldNeeds' as keyof IkigaiAnswers,
        label: 'Mundo precisa',
        title: 'O que o MUNDO precisa?',
        description: 'Pense nos problemas que te incomodam, nas causas que você apoia e no impacto que gostaria de deixar.',
        icon: Globe,
        color: '#81C784',
        questions: [
            'Quais problemas do mundo você gostaria de resolver?',
            'Que tipo de impacto você gostaria de deixar?',
            'Quais causas você apoia ou gostaria de apoiar?',
            'O que as pessoas próximas precisam que você poderia oferecer?',
            'Quais tendências você observa crescendo na sociedade?',
            'Se pudesse resolver um problema para muitas pessoas, qual seria?',
        ],
    },
    {
        id: 'paidFor',
        key: 'paidFor' as keyof IkigaiAnswers,
        label: 'Ser pago',
        title: 'Pelo que você pode ser PAGO?',
        description: 'Considere suas habilidades que geram valor de mercado e oportunidades profissionais.',
        icon: Coins,
        color: '#FFD54F',
        questions: [
            'Quais habilidades suas já geraram ou poderiam gerar renda?',
            'Quais profissões ou áreas de atuação te interessam?',
            'O que o mercado de trabalho valoriza que você sabe fazer?',
            'Você já foi pago por algum talento seu?',
            'Quais serviços ou produtos você poderia oferecer hoje?',
            'Em qual nicho você vê oportunidades para você?',
        ],
    },
];

export function QuestionnaireStep({
    currentStep,
    answers,
    onAnswersChange,
    onNext,
    onBack,
    onComplete,
    isLoading,
    className,
}: QuestionnaireStepProps) {
    const step = steps[currentStep];
    const currentAnswers = answers[step.key];
    const isLastStep = currentStep === steps.length - 1;
    const canProceed = currentAnswers.length > 0;

    const handleTagsChange = (tags: string[]) => {
        onAnswersChange({ [step.key]: tags });
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Progress */}
            <ProgressBar currentStep={currentStep + 1} totalSteps={steps.length} />

            {/* Step Indicator */}
            <StepIndicator
                steps={steps.map((s) => ({ id: s.id, label: s.label }))}
                currentStep={currentStep}
            />

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    {/* Title Card */}
                    <div
                        className="bg-surface rounded-2xl p-6 border-2 shadow-sm"
                        style={{ borderColor: `${step.color}40` }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: `${step.color}20`, color: step.color }}
                            >
                                <step.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        </div>

                        {/* Tag Input */}
                        <TagInput
                            tags={currentAnswers}
                            onTagsChange={handleTagsChange}
                            placeholder="Digite suas respostas e pressione Enter..."
                            variant={step.key}
                            maxTags={15}
                        />
                    </div>

                    {/* Questions as hints */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            Perguntas para te ajudar a refletir:
                        </h3>
                        <div className="grid gap-2 md:grid-cols-2">
                            {step.questions.map((question, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground"
                                >
                                    {index + 1}. {question}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    disabled={currentStep === 0}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>

                {isLastStep ? (
                    <Button
                        type="button"
                        onClick={onComplete}
                        disabled={!canProceed || isLoading}
                        size="lg"
                    >
                        {isLoading ? 'Finalizando...' : 'Finalizar e ver resultado'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                    >
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
