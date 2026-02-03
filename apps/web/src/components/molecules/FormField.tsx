'use client';

import * as React from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'number' | 'email' | 'textarea';
    placeholder?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    error?: string;
    required?: boolean;
    className?: string;
    min?: number;
    max?: number;
}

export function FormField({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required,
    className,
    min,
    max,
}: FormFieldProps) {
    const inputId = `field-${name}`;

    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={inputId}>
                {label}
                {required && <span className="text-ikigai-love ml-1">*</span>}
            </Label>

            {type === 'textarea' ? (
                <Textarea
                    id={inputId}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(error && 'border-ikigai-love focus-visible:ring-ikigai-love')}
                />
            ) : (
                <Input
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                    min={min}
                    max={max}
                    className={cn(error && 'border-ikigai-love focus-visible:ring-ikigai-love')}
                />
            )}

            {error && (
                <p className="text-sm text-ikigai-love">{error}</p>
            )}
        </div>
    );
}
