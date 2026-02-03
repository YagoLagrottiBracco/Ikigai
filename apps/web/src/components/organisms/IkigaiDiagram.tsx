'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IkigaiAnswers, IKIGAI_LABELS } from '@ikigai/shared';
import { Heart, Lightbulb, Globe, Coins, X, Sparkles } from 'lucide-react';

interface IkigaiDiagramProps {
    answers: IkigaiAnswers;
    showAnimation?: boolean;
    interactive?: boolean;
}

interface TooltipData {
    title: string;
    items: string[];
    color: string;
    icon: React.ElementType;
}

const sections = [
    {
        key: 'love' as const,
        label: IKIGAI_LABELS.love,
        shortLabel: 'Ama',
        icon: Heart,
        color: '#FF6B9D',
        bgColor: 'rgba(255, 107, 157, 0.25)'
    },
    {
        key: 'skills' as const,
        label: IKIGAI_LABELS.skills,
        shortLabel: 'Bom',
        icon: Lightbulb,
        color: '#4ECDC4',
        bgColor: 'rgba(78, 205, 196, 0.25)'
    },
    {
        key: 'worldNeeds' as const,
        label: IKIGAI_LABELS.worldNeeds,
        shortLabel: 'Mundo',
        icon: Globe,
        color: '#45B7D1',
        bgColor: 'rgba(69, 183, 209, 0.25)'
    },
    {
        key: 'paidFor' as const,
        label: IKIGAI_LABELS.paidFor,
        shortLabel: 'Pago',
        icon: Coins,
        color: '#F7B731',
        bgColor: 'rgba(247, 183, 49, 0.25)'
    }
];

export function IkigaiDiagram({ answers, showAnimation = true, interactive = true }: IkigaiDiagramProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);
    const [showCenter, setShowCenter] = useState(false);

    useEffect(() => {
        if (showAnimation) {
            const timer = setTimeout(() => {
                setShowCenter(true);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setShowCenter(true);
        }
    }, [showAnimation]);

    const handleSectionClick = (section: typeof sections[0]) => {
        if (!interactive) return;

        const items = answers[section.key] || [];
        if (items.length === 0) return;

        if (activeSection === section.key) {
            setActiveSection(null);
            setTooltip(null);
        } else {
            setActiveSection(section.key);
            setTooltip({
                title: section.label,
                items,
                color: section.color,
                icon: section.icon
            });
        }
    };

    const closeTooltip = () => {
        setTooltip(null);
        setActiveSection(null);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '60px 20px 20px'
        }}>
            {/* Main Diagram Container */}
            <div style={{
                position: 'relative',
                width: 600,
                height: 600
            }}>
                {/* SVG Diagram */}
                <svg viewBox="0 0 500 500" style={{ width: '100%', height: '100%' }}>
                    <defs>
                        <radialGradient id="gradLove" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#FF6B9D" stopOpacity="0.35" />
                        </radialGradient>
                        <radialGradient id="gradSkills" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.35" />
                        </radialGradient>
                        <radialGradient id="gradWorld" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#45B7D1" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#45B7D1" stopOpacity="0.35" />
                        </radialGradient>
                        <radialGradient id="gradPaid" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#F7B731" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#F7B731" stopOpacity="0.35" />
                        </radialGradient>
                        <radialGradient id="gradCenter" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#9D4EDD" stopOpacity="1" />
                            <stop offset="100%" stopColor="#7B2CBF" stopOpacity="0.95" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="softGlow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Four overlapping circles */}
                    <motion.circle
                        cx={250} cy={160} r={130}
                        fill="url(#gradLove)"
                        style={{ mixBlendMode: 'screen' }}
                        initial={showAnimation ? { scale: 0 } : { scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: showAnimation ? 0.2 : 0, duration: 0.7, type: 'spring' }}
                    />
                    <motion.circle
                        cx={345} cy={250} r={130}
                        fill="url(#gradSkills)"
                        style={{ mixBlendMode: 'screen' }}
                        initial={showAnimation ? { scale: 0 } : { scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: showAnimation ? 0.4 : 0, duration: 0.7, type: 'spring' }}
                    />
                    <motion.circle
                        cx={250} cy={340} r={130}
                        fill="url(#gradWorld)"
                        style={{ mixBlendMode: 'screen' }}
                        initial={showAnimation ? { scale: 0 } : { scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: showAnimation ? 0.6 : 0, duration: 0.7, type: 'spring' }}
                    />
                    <motion.circle
                        cx={155} cy={250} r={130}
                        fill="url(#gradPaid)"
                        style={{ mixBlendMode: 'screen' }}
                        initial={showAnimation ? { scale: 0 } : { scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: showAnimation ? 0.8 : 0, duration: 0.7, type: 'spring' }}
                    />

                    {/* Labels with connecting lines */}
                    {/* Top - Love (circle at cx=250, cy=160) */}
                    <motion.g
                        initial={showAnimation ? { opacity: 0, y: 10 } : { opacity: 1 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: showAnimation ? 1.0 : 0 }}
                    >
                        <line x1="250" y1="25" x2="250" y2="50" stroke="#FF6B9D" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                        <circle cx="250" cy="25" r="4" fill="#FF6B9D" />
                    </motion.g>

                    {/* Right - Skills (circle at cx=345, cy=250) */}
                    <motion.g
                        initial={showAnimation ? { opacity: 0, x: -10 } : { opacity: 1 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showAnimation ? 1.1 : 0 }}
                    >
                        <line x1="475" y1="250" x2="450" y2="250" stroke="#4ECDC4" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                        <circle cx="475" cy="250" r="4" fill="#4ECDC4" />
                    </motion.g>

                    {/* Bottom - World (circle at cx=250, cy=340) */}
                    <motion.g
                        initial={showAnimation ? { opacity: 0, y: -10 } : { opacity: 1 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: showAnimation ? 1.2 : 0 }}
                    >
                        <line x1="250" y1="475" x2="250" y2="450" stroke="#45B7D1" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                        <circle cx="250" cy="475" r="4" fill="#45B7D1" />
                    </motion.g>

                    {/* Left - Paid (circle at cx=155, cy=250) */}
                    <motion.g
                        initial={showAnimation ? { opacity: 0, x: 10 } : { opacity: 1 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showAnimation ? 1.3 : 0 }}
                    >
                        <line x1="25" y1="250" x2="50" y2="250" stroke="#F7B731" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
                        <circle cx="25" cy="250" r="4" fill="#F7B731" />
                    </motion.g>

                    {/* Center IKIGAI */}
                    <AnimatePresence>
                        {showCenter && (
                            <motion.g
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            >
                                <motion.circle
                                    cx={250} cy={250} r={70}
                                    fill="none"
                                    stroke="#9D4EDD"
                                    strokeWidth={2}
                                    opacity={0.5}
                                    animate={{ r: [70, 85, 70], opacity: [0.5, 0.7, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                />
                                <circle
                                    cx={250} cy={250} r={60}
                                    fill="url(#gradCenter)"
                                    filter="url(#glow)"
                                />
                                <g transform="translate(235, 230)">
                                    <Sparkles size={30} color="white" />
                                </g>
                                <text
                                    x={250} y={280}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="14"
                                    fontWeight="700"
                                    letterSpacing="4"
                                    style={{ fontFamily: 'system-ui, sans-serif' }}
                                >
                                    IKIGAI
                                </text>
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Labels positioned absolutely around the diagram */}
                {/* Top - Love */}
                <motion.button
                    initial={showAnimation ? { opacity: 0, y: 20 } : { opacity: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: showAnimation ? 1.0 : 0 }}
                    onClick={() => handleSectionClick(sections[0])}
                    style={{
                        position: 'absolute',
                        top: -25,
                        left: 'calc(50% - 100px)',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 28px',
                        background: activeSection === 'love' ? sections[0].color : sections[0].bgColor,
                        border: `2px solid ${sections[0].color}`,
                        borderRadius: 50,
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        color: activeSection === 'love' ? 'white' : sections[0].color,
                        fontWeight: 600,
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        boxShadow: activeSection === 'love' ? `0 0 30px ${sections[0].color}50` : 'none'
                    }}
                >
                    <Heart size={20} />
                    {sections[0].label}
                </motion.button>

                {/* Right - Skills */}
                <motion.button
                    initial={showAnimation ? { opacity: 0, x: -20 } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: showAnimation ? 1.1 : 0 }}
                    onClick={() => handleSectionClick(sections[1])}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: -100,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 28px',
                        background: activeSection === 'skills' ? sections[1].color : sections[1].bgColor,
                        border: `2px solid ${sections[1].color}`,
                        borderRadius: 50,
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        color: activeSection === 'skills' ? 'white' : sections[1].color,
                        fontWeight: 600,
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        boxShadow: activeSection === 'skills' ? `0 0 30px ${sections[1].color}50` : 'none'
                    }}
                >
                    <Lightbulb size={20} />
                    {sections[1].label}
                </motion.button>

                {/* Bottom - World */}
                <motion.button
                    initial={showAnimation ? { opacity: 0, y: -20 } : { opacity: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: showAnimation ? 1.2 : 0 }}
                    onClick={() => handleSectionClick(sections[2])}
                    style={{
                        position: 'absolute',
                        bottom: -20,
                        left: 'calc(50% - 135px)',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 28px',
                        background: activeSection === 'worldNeeds' ? sections[2].color : sections[2].bgColor,
                        border: `2px solid ${sections[2].color}`,
                        borderRadius: 50,
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        color: activeSection === 'worldNeeds' ? 'white' : sections[2].color,
                        fontWeight: 600,
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        boxShadow: activeSection === 'worldNeeds' ? `0 0 30px ${sections[2].color}50` : 'none'
                    }}
                >
                    <Globe size={20} />
                    {sections[2].label}
                </motion.button>

                {/* Left - Paid */}
                <motion.button
                    initial={showAnimation ? { opacity: 0, x: 20 } : { opacity: 1 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: showAnimation ? 1.3 : 0 }}
                    onClick={() => handleSectionClick(sections[3])}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: -100,
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '14px 28px',
                        background: activeSection === 'paidFor' ? sections[3].color : sections[3].bgColor,
                        border: `2px solid ${sections[3].color}`,
                        borderRadius: 50,
                        cursor: interactive ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        color: activeSection === 'paidFor' ? 'white' : sections[3].color,
                        fontWeight: 600,
                        fontSize: '1rem',
                        whiteSpace: 'nowrap',
                        boxShadow: activeSection === 'paidFor' ? `0 0 30px ${sections[3].color}50` : 'none'
                    }}
                >
                    <Coins size={20} />
                    {sections[3].label}
                </motion.button>
            </div>

            {/* Instruction text */}
            <motion.p
                initial={showAnimation ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: showAnimation ? 1.5 : 0 }}
                style={{
                    textAlign: 'center',
                    marginTop: 100,
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.95rem'
                }}
            >
                Clique em cada categoria para ver suas respostas
            </motion.p>

            {/* Tooltip Modal */}
            <AnimatePresence>
                {tooltip && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeTooltip}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.7)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 999
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(145deg, #1a1a2e 0%, #16162a 100%)',
                                border: `2px solid ${tooltip.color}`,
                                borderRadius: 24,
                                padding: 32,
                                maxWidth: 420,
                                width: '90%',
                                zIndex: 1000,
                                boxShadow: `0 30px 100px rgba(0,0,0,0.6), 0 0 60px ${tooltip.color}25`
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 24
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 16,
                                        background: `${tooltip.color}25`,
                                        border: `1px solid ${tooltip.color}40`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <tooltip.icon size={28} color={tooltip.color} />
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'white', fontSize: '1.3rem' }}>
                                        {tooltip.title}
                                    </span>
                                </div>
                                <button
                                    onClick={closeTooltip}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 12,
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {tooltip.items.map((item, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{
                                            padding: '12px 20px',
                                            borderRadius: 30,
                                            background: `${tooltip.color}15`,
                                            border: `1px solid ${tooltip.color}45`,
                                            color: 'white',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
