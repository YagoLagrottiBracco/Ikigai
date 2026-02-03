'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { IkigaiSession } from '@ikigai/shared';
import { Download, Share2, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

const COLORS = {
    love: '#FF6B6B',
    skills: '#4ECDC4',
    world: '#95D5B2',
    paid: '#FFD93D',
    ikigai: '#9D4EDD',
    bg: '#0A0A0B'
};

export default function WrappedPage() {
    const params = useParams();
    const hash = params.hash as string;
    const cardRef = useRef<HTMLDivElement>(null);

    const [session, setSession] = useState<IkigaiSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${hash}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setSession(data);
                }
            } catch (error) {
                console.error('Erro ao buscar sessão:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [hash]);

    const handleDownloadImage = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: COLORS.bg,
                scale: 2
            });

            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `ikigai-${session?.context.name || 'wrapped'}.png`;
            a.click();
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = session
        ? `Descobri meu Ikigai! 🎯 Veja minhas principais carreiras e propósito de vida.`
        : '';

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: COLORS.bg
            }}>
                <div className="animate-spin-slow" style={{ color: COLORS.ikigai }}>⏳</div>
            </div>
        );
    }

    if (!session || !session.aiAnalysis) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: COLORS.bg,
                color: '#FAFAFA'
            }}>
                Sessão não encontrada ou análise pendente.
            </div>
        );
    }

    const topCareers = session.aiAnalysis.suggestedCareers.slice(0, 3);

    return (
        <main style={{
            background: COLORS.bg,
            minHeight: '100vh',
            padding: 'var(--space-8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-8)'
        }}>
            {/* Wrapped Card */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: 400,
                    background: 'linear-gradient(135deg, #141416 0%, #1C1C1F 100%)',
                    borderRadius: 24,
                    padding: 32,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Background decorations */}
                <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: `${COLORS.love}20`,
                    filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `${COLORS.skills}20`,
                    filter: 'blur(50px)'
                }} />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
                    <p style={{
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: COLORS.ikigai,
                        marginBottom: 8
                    }}>
                        MEU IKIGAI 2026
                    </p>
                    <h2 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: '#FAFAFA',
                        marginBottom: 4
                    }}>
                        {session.context.name}
                    </h2>
                    <p style={{ fontSize: 14, color: '#71717A' }}>
                        {session.context.currentProfession} • {session.context.age} anos
                    </p>
                </div>

                {/* Mini Ikigai Diagram */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 32,
                    position: 'relative'
                }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        {/* Circles */}
                        <circle cx="60" cy="45" r="30" fill={COLORS.love} fillOpacity="0.3" />
                        <circle cx="75" cy="60" r="30" fill={COLORS.skills} fillOpacity="0.3" />
                        <circle cx="60" cy="75" r="30" fill={COLORS.world} fillOpacity="0.3" />
                        <circle cx="45" cy="60" r="30" fill={COLORS.paid} fillOpacity="0.3" />
                        {/* Center */}
                        <circle cx="60" cy="60" r="15" fill={COLORS.ikigai} />
                        <text x="60" y="63" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                            生き甲斐
                        </text>
                    </svg>
                </div>

                {/* Top 3 Careers */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: '#71717A',
                        marginBottom: 12
                    }}>
                        CARREIRAS IDEAIS
                    </p>
                    {topCareers.map((career, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 0',
                                borderBottom: index < topCareers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                            }}
                        >
                            <span style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: index === 0
                                    ? COLORS.ikigai
                                    : index === 1
                                        ? COLORS.skills
                                        : COLORS.world,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                {index + 1}
                            </span>
                            <span style={{ color: '#FAFAFA', fontSize: 14 }}>
                                {career}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Keywords */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {[
                        ...session.answers.love.slice(0, 2),
                        ...session.answers.skills.slice(0, 2)
                    ].map((item, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 10px',
                                borderRadius: 100,
                                fontSize: 11,
                                background: 'rgba(157, 78, 221, 0.15)',
                                color: COLORS.ikigai
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <p style={{ fontSize: 10, color: '#525252' }}>
                        ikigai.app • Descubra seu propósito
                    </p>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={handleDownloadImage} className="btn-primary">
                    <Download size={18} />
                    Baixar Imagem
                </button>

                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    <Twitter size={18} />
                    Twitter
                </a>

                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    <Linkedin size={18} />
                    LinkedIn
                </a>

                <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </a>
            </div>
        </main>
    );
}
