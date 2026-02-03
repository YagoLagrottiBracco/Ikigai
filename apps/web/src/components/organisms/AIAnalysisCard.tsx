'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AIAnalysis } from '@ikigai/shared';
import { cn } from '@/lib/utils';
import {
    User,
    Briefcase,
    AlertCircle,
    Target,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

interface AIAnalysisCardProps {
    analysis: AIAnalysis;
    className?: string;
}

export function AIAnalysisCard({ analysis, className }: AIAnalysisCardProps) {
    const sections = [
        {
            id: 'profile',
            title: 'Resumo do seu Perfil',
            icon: User,
            color: '#5B7C6F',
            content: analysis.profileSummary,
            type: 'text',
        },
        {
            id: 'situation',
            title: 'Análise da Situação Atual',
            icon: TrendingUp,
            color: '#64B5F6',
            content: analysis.currentSituationAnalysis,
            type: 'text',
        },
        {
            id: 'careers',
            title: 'Carreiras Sugeridas',
            icon: Briefcase,
            color: '#81C784',
            content: analysis.suggestedCareers,
            type: 'list',
        },
        {
            id: 'gaps',
            title: 'Pontos de Desenvolvimento',
            icon: AlertCircle,
            color: '#FFD54F',
            content: analysis.identifiedGaps,
            type: 'list',
        },
        {
            id: 'action',
            title: 'Seu Plano de Ação',
            icon: Target,
            color: '#E57373',
            content: analysis.actionPlan,
            type: 'text',
        },
    ];

    return (
        <div className={cn('space-y-6', className)}>
            {sections.map((section, index) => {
                if (section.type === 'list' && Array.isArray(section.content) && section.content.length === 0) {
                    return null;
                }

                return (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-surface rounded-2xl p-6 border border-border shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${section.color}20`, color: section.color }}
                            >
                                <section.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {section.title}
                            </h3>
                        </div>

                        {section.type === 'text' ? (
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {section.content as string}
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {(section.content as string[]).map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2
                                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                                            style={{ color: section.color }}
                                        />
                                        <span className="text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}
