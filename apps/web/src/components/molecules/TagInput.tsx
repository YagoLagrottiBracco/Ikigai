'use client';

import * as React from 'react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Tag } from '../atoms/Tag';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    variant?: 'love' | 'skills' | 'worldNeeds' | 'paidFor' | 'default';
    maxTags?: number;
    className?: string;
}

export function TagInput({
    tags,
    onTagsChange,
    placeholder = 'Digite e pressione Enter...',
    variant = 'default',
    maxTags = 10,
    className,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAddTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
            onTagsChange([...tags, trimmed]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button
                    type="button"
                    onClick={handleAddTag}
                    size="icon"
                    disabled={!inputValue.trim() || tags.length >= maxTags}
                >
                    <Plus className="w-5 h-5" />
                </Button>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {tags.map((tag) => (
                            <Tag
                                key={tag}
                                variant={variant}
                                onRemove={() => handleRemoveTag(tag)}
                            >
                                {tag}
                            </Tag>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {tags.length >= maxTags && (
                <p className="text-sm text-muted-foreground">
                    Limite de {maxTags} itens atingido
                </p>
            )}
        </div>
    );
}
