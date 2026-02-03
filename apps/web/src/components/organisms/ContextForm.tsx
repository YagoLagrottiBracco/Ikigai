'use client';

import * as React from 'react';
import { useState } from 'react';
import { LifeStage, LIFE_STAGE_LABELS, IkigaiContext } from '@ikigai/shared';
import { Button } from '../atoms';
import { FormField } from '../molecules';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap, Heart } from 'lucide-react';

interface ContextFormProps {
    onSubmit: (context: IkigaiContext) => void;
    isLoading?: boolean;
    className?: string;
}

const lifeStages: { value: LifeStage; label: string }[] = [
    { value: 'student', label: LIFE_STAGE_LABELS.student },
    { value: 'employed', label: LIFE_STAGE_LABELS.employed },
    { value: 'unemployed', label: LIFE_STAGE_LABELS.unemployed },
    { value: 'transition', label: LIFE_STAGE_LABELS.transition },
    { value: 'retired', label: LIFE_STAGE_LABELS.retired },
];

export function ContextForm({ onSubmit, isLoading, className }: ContextFormProps) {
    const [formData, setFormData] = useState<IkigaiContext>({
        name: '',
        age: 25,
        currentProfession: '',
        educationArea: '',
        lifeStage: 'employed',
        currentSituation: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof IkigaiContext, string>>>({});

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof IkigaiContext, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        if (formData.age < 10 || formData.age > 120) {
            newErrors.age = 'Idade deve estar entre 10 e 120 anos';
        }
        if (!formData.currentProfession.trim()) {
            newErrors.currentProfession = 'Profissão é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const updateField = (field: keyof IkigaiContext, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className={cn('space-y-6', className)}
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Vamos começar!
                </h2>
                <p className="text-muted-foreground">
                    Primeiro, conte um pouco sobre você para personalizarmos sua experiência.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <FormField
                    label="Seu nome"
                    name="name"
                    placeholder="Como você gostaria de ser chamado(a)?"
                    value={formData.name}
                    onChange={(v) => updateField('name', v)}
                    error={errors.name}
                    required
                />

                <FormField
                    label="Sua idade"
                    name="age"
                    type="number"
                    min={10}
                    max={120}
                    value={formData.age}
                    onChange={(v) => updateField('age', v)}
                    error={errors.age}
                    required
                />

                <FormField
                    label="Profissão atual"
                    name="currentProfession"
                    placeholder="O que você faz hoje?"
                    value={formData.currentProfession}
                    onChange={(v) => updateField('currentProfession', v)}
                    error={errors.currentProfession}
                    required
                />

                <FormField
                    label="Área de formação"
                    name="educationArea"
                    placeholder="Qual sua área de estudo/formação?"
                    value={formData.educationArea}
                    onChange={(v) => updateField('educationArea', v)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Momento de vida</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {lifeStages.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => updateField('lifeStage', value)}
                            className={cn(
                                'p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                                formData.lifeStage === value
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-surface text-muted-foreground hover:border-primary/50'
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <FormField
                label="Descreva sua situação atual"
                name="currentSituation"
                type="textarea"
                placeholder="O que te trouxe aqui? Como você se sente em relação à sua carreira? Compartilhe o que quiser..."
                value={formData.currentSituation}
                onChange={(v) => updateField('currentSituation', v)}
            />

            <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Criando sua jornada...' : 'Começar meu Ikigai'}
            </Button>
        </motion.form>
    );
}
