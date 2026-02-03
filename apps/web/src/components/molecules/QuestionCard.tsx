'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuestionCardProps {
    question: string;
    description?: string;
    icon?: LucideIcon;
    color?: string;
    className?: string;
    children?: React.ReactNode;
}

export function QuestionCard({
    question,
    description,
    icon: Icon,
    color = 'primary',
    className,
    children,
}: QuestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
                'bg-surface rounded-2xl p-6 shadow-sm border border-border',
                className
            )}
        >
            <div className="flex items-start gap-4 mb-4">
                {Icon && (
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}20`, color }}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        {question}
                    </h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {children}
        </motion.div>
    );
}
