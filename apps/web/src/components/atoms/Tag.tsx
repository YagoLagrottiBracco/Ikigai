'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TagProps {
    children: React.ReactNode;
    onRemove?: () => void;
    variant?: 'love' | 'skills' | 'worldNeeds' | 'paidFor' | 'default';
    className?: string;
}

const variantColors = {
    love: 'bg-ikigai-love/20 text-ikigai-love border-ikigai-love/30',
    skills: 'bg-ikigai-skills/20 text-ikigai-skills border-ikigai-skills/30',
    worldNeeds: 'bg-ikigai-world/20 text-ikigai-world border-ikigai-world/30',
    paidFor: 'bg-ikigai-paid/20 text-ikigai-paid border-ikigai-paid/30',
    default: 'bg-primary/10 text-primary border-primary/20',
};

export function Tag({ children, onRemove, variant = 'default', className }: TagProps) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
                variantColors[variant],
                className
            )}
        >
            {children}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </motion.span>
    );
}
