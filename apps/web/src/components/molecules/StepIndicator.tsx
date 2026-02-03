'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Globe, Coins } from 'lucide-react';

interface StepIndicatorProps {
    steps: { id: string; label: string }[];
    currentStep: number;
    className?: string;
}

const icons = [Heart, Lightbulb, Globe, Coins];
const colors = ['ikigai-love', 'ikigai-skills', 'ikigai-world', 'ikigai-paid'];

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
    return (
        <div className={cn('flex items-center justify-center gap-4', className)}>
            {steps.map((step, index) => {
                const Icon = icons[index] || Heart;
                const color = colors[index] || 'primary';
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <React.Fragment key={step.id}>
                        <motion.div
                            className={cn(
                                'flex flex-col items-center gap-1',
                                isActive && 'scale-110',
                            )}
                            animate={{ scale: isActive ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                                    isActive && `bg-${color} text-white shadow-lg`,
                                    isCompleted && `bg-${color}/20 text-${color}`,
                                    !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                                )}
                                style={{
                                    backgroundColor: isActive ? `var(--${color.replace('ikigai-', 'ikigai-')})` : undefined,
                                    color: isActive ? 'white' : undefined,
                                }}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                'text-xs font-medium hidden sm:block',
                                isActive && 'text-foreground',
                                !isActive && 'text-muted-foreground',
                            )}>
                                {step.label}
                            </span>
                        </motion.div>

                        {index < steps.length - 1 && (
                            <div className={cn(
                                'w-8 h-0.5 rounded',
                                index < currentStep ? 'bg-primary' : 'bg-muted',
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
