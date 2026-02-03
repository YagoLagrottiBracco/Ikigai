'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IkigaiSession } from '@ikigai/shared';
import { motion } from 'framer-motion';
import { IkigaiDiagram, AIAnalysisCard } from '@/components/organisms';
import Link from 'next/link';
import {
    ArrowLeft,
    Download,
    Share2,
    RefreshCw,
    Loader2,
    Star,
    Target,
    TrendingUp,
    AlertTriangle,
    Sparkles,
    CheckCircle,
    Copy,
    Twitter,
    Linkedin,
    MessageCircle
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function ResultadoPage() {
    const params = useParams();
    const hash = params.hash as string;

    const [session, setSession] = useState<IkigaiSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const fetchSession = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${hash}`
            );
            if (!response.ok) throw new Error('Sessão não encontrada');
            const data = await response.json();
            setSession(data);

            // Auto-analyze if not analyzed yet
            if (data.status !== 'analyzed' && !data.aiAnalysis) {
                analyzeSession();
            }
        } catch (err) {
            setError('Sessão não encontrada');
        } finally {
            setLoading(false);
        }
    };

    const analyzeSession = async () => {
        setAnalyzing(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${hash}/analyze`,
                { method: 'POST' }
            );
            const data = await response.json();
            setSession(data);
        } catch (err) {
            setError('Erro ao analisar. Tente novamente.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleDownloadPdf = async () => {
        setDownloadingPdf(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/sessions/${hash}/pdf`
            );
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ikigai-${session?.context?.name || 'resultado'}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Erro ao baixar PDF');
        } finally {
            setDownloadingPdf(false);
        }
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = session
        ? `Descobri meu Ikigai! Veja a análise personalizada que a IA fez para mim 🎯`
        : '';

    useEffect(() => {
        // Redirect if hash is invalid
        if (!hash || hash === 'undefined') {
            setError('Sessão inválida');
            return;
        }
        fetchSession();
    }, [hash]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg)',
                gap: 'var(--space-4)'
            }}>
                <Loader2 size={40} className="animate-spin-slow" color="var(--color-ikigai)" />
                <p style={{ color: 'var(--color-text-secondary)' }}>Carregando seu Ikigai...</p>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg)',
                gap: 'var(--space-4)',
                padding: 'var(--space-4)'
            }}>
                <AlertTriangle size={48} color="var(--color-love)" />
                <h2 style={{ color: 'var(--color-text-primary)', textAlign: 'center' }}>
                    {error || 'Sessão não encontrada'}
                </h2>
                <Link href="/questionario">
                    <button className="btn-primary">
                        <ArrowLeft size={18} />
                        Fazer novo questionário
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <main style={{
            background: 'var(--color-bg)',
            minHeight: '100vh',
            paddingTop: 'var(--space-8)',
            paddingBottom: 'var(--space-12)'
        }}>
            <div className="container" style={{ maxWidth: 1000 }}>
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-8)',
                        flexWrap: 'wrap',
                        gap: 'var(--space-4)'
                    }}
                >
                    <div>
                        <h1 style={{ marginBottom: 'var(--space-2)' }}>
                            Olá, <span className="text-gradient">{session.context?.name || 'Visitante'}</span>! 👋
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {session.aiAnalysis
                                ? 'Sua análise Ikigai está pronta!'
                                : 'Analisando suas respostas...'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        {/* Share Button */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="btn-secondary"
                            >
                                <Share2 size={18} />
                                Compartilhar
                            </button>

                            {showShareMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="glass-card"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: 'var(--space-2)',
                                        padding: 'var(--space-3)',
                                        minWidth: 200,
                                        zIndex: 100
                                    }}
                                >
                                    <button
                                        onClick={handleCopyLink}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            width: '100%',
                                            padding: 'var(--space-2)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-text-primary)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        {copied ? <CheckCircle size={16} color="var(--color-world)" /> : <Copy size={16} />}
                                        {copied ? 'Copiado!' : 'Copiar link'}
                                    </button>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            width: '100%',
                                            padding: 'var(--space-2)',
                                            color: 'var(--color-text-primary)',
                                            textDecoration: 'none',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <Twitter size={16} />
                                        Twitter
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            width: '100%',
                                            padding: 'var(--space-2)',
                                            color: 'var(--color-text-primary)',
                                            textDecoration: 'none',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <Linkedin size={16} />
                                        LinkedIn
                                    </a>
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            width: '100%',
                                            padding: 'var(--space-2)',
                                            color: 'var(--color-text-primary)',
                                            textDecoration: 'none',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </a>
                                </motion.div>
                            )}
                        </div>

                        {/* Download PDF */}
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloadingPdf || !session.aiAnalysis}
                            className="btn-primary"
                            style={{
                                opacity: downloadingPdf || !session.aiAnalysis ? 0.7 : 1
                            }}
                        >
                            {downloadingPdf ? (
                                <Loader2 size={18} className="animate-spin-slow" />
                            ) : (
                                <Download size={18} />
                            )}
                            Baixar PDF
                        </button>
                    </div>
                </motion.div>

                {/* Analyzing Loading State */}
                {analyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card"
                        style={{
                            padding: 'var(--space-10)',
                            textAlign: 'center',
                            marginBottom: 'var(--space-8)'
                        }}
                    >
                        <Loader2 size={40} className="animate-spin-slow" color="var(--color-ikigai)" style={{ margin: '0 auto var(--space-4)' }} />
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Analisando seu perfil...</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Nossa IA está processando suas respostas. Isso pode levar alguns segundos.
                        </p>
                    </motion.div>
                )}

                {/* Diagram */}
                {!analyzing && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ delay: 0.1 }}
                        className="glass-card"
                        style={{
                            padding: 'var(--space-8)',
                            marginBottom: 'var(--space-8)',
                            textAlign: 'center'
                        }}
                    >
                        <h2 style={{ marginBottom: 'var(--space-6)' }}>
                            <Sparkles size={24} style={{ display: 'inline', marginRight: 'var(--space-2)', color: 'var(--color-ikigai)' }} />
                            Seu Diagrama Ikigai
                        </h2>
                        <IkigaiDiagram answers={session.answers} showAnimation={true} interactive={true} />
                    </motion.div>
                )}

                {/* AI Analysis */}
                {session.aiAnalysis && !analyzing && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
                            <Target size={24} style={{ display: 'inline', marginRight: 'var(--space-2)', color: 'var(--color-world)' }} />
                            Análise Personalizada
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                            {/* Profile Summary */}
                            <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--gradient-ikigai)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Sparkles size={20} color="white" />
                                    </div>
                                    <h3 style={{ margin: 0 }}>Resumo do seu Perfil</h3>
                                </div>
                                <p style={{ lineHeight: 1.8 }}>{session.aiAnalysis.profileSummary}</p>
                            </div>

                            {/* Suggested Careers */}
                            <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--gradient-world)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <TrendingUp size={20} color="white" />
                                    </div>
                                    <h3 style={{ margin: 0 }}>Carreiras Sugeridas</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {session.aiAnalysis.suggestedCareers.map((career, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3)',
                                                background: 'var(--color-surface)',
                                                borderRadius: 'var(--radius-lg)'
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-1)',
                                                flexShrink: 0
                                            }}>
                                                <span style={{
                                                    fontWeight: 700,
                                                    color: 'var(--color-ikigai)',
                                                    fontSize: '1.2rem'
                                                }}>
                                                    #{index + 1}
                                                </span>
                                                {[...Array(5 - index)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill="var(--color-paid)"
                                                        color="var(--color-paid)"
                                                    />
                                                ))}
                                            </div>
                                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{career}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Gaps */}
                            {session.aiAnalysis.identifiedGaps.length > 0 && (
                                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--gradient-paid)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <AlertTriangle size={20} color="white" />
                                        </div>
                                        <h3 style={{ margin: 0 }}>Pontos de Desenvolvimento</h3>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {session.aiAnalysis.identifiedGaps.map((gap, index) => (
                                            <li
                                                key={index}
                                                style={{
                                                    padding: 'var(--space-3) 0',
                                                    borderBottom: index < session.aiAnalysis!.identifiedGaps.length - 1
                                                        ? '1px solid var(--color-border)'
                                                        : 'none',
                                                    color: 'var(--color-text-secondary)'
                                                }}
                                            >
                                                • {gap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Action Plan */}
                            <div className="glass-card" style={{
                                padding: 'var(--space-6)',
                                background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--gradient-skills)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Target size={20} color="white" />
                                    </div>
                                    <h3 style={{ margin: 0 }}>Seu Plano de Ação</h3>
                                </div>
                                <p style={{ lineHeight: 1.8 }}>{session.aiAnalysis.actionPlan}</p>
                            </div>

                            {/* Situation Analysis */}
                            {session.aiAnalysis.currentSituationAnalysis && (
                                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 'var(--radius-lg)',
                                            background: 'var(--gradient-love)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Star size={20} color="white" />
                                        </div>
                                        <h3 style={{ margin: 0 }}>Análise da Situação Atual</h3>
                                    </div>
                                    <p style={{ lineHeight: 1.8 }}>{session.aiAnalysis.currentSituationAnalysis}</p>
                                </div>
                            )}
                        </div>

                        {/* Retry Analysis Button */}
                        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
                            <button
                                onClick={analyzeSession}
                                disabled={analyzing}
                                className="btn-secondary"
                            >
                                <RefreshCw size={18} />
                                Gerar nova análise
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* No Analysis Yet */}
                {!session.aiAnalysis && !analyzing && (
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
                        <button
                            onClick={analyzeSession}
                            className="btn-primary"
                            style={{ padding: 'var(--space-4) var(--space-8)' }}
                        >
                            <Sparkles size={20} />
                            Gerar Análise com IA
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside to close share menu */}
            {showShareMenu && (
                <div
                    onClick={() => setShowShareMenu(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 50 }}
                />
            )}
        </main>
    );
}
