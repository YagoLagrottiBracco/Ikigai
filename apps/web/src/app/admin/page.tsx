'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    DollarSign,
    TrendingUp,
    FileText,
    Mail,
    Calendar,
    Download,
    RefreshCw,
    Filter,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface AdminStats {
    totalSessions: number;
    totalAnalyzed: number;
    totalRevenue: number;
    emailsSent: number;
    conversionRate: number;
    revenueChange: number;
}

interface SessionSummary {
    hash: string;
    name: string;
    email?: string;
    status: string;
    plan?: string;
    createdAt: string;
    analyzedAt?: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function AdminPage() {
    const [stats, setStats] = useState<AdminStats>({
        totalSessions: 0,
        totalAnalyzed: 0,
        totalRevenue: 0,
        emailsSent: 0,
        conversionRate: 0,
        revenueChange: 0
    });
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('7d');

    useEffect(() => {
        fetchData();
    }, [dateFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/admin/stats?period=${dateFilter}`
            );

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setSessions(data.sessions);
            } else {
                // Demo data when API not available
                setStats({
                    totalSessions: 47,
                    totalAnalyzed: 32,
                    totalRevenue: 287.53,
                    emailsSent: 28,
                    conversionRate: 68.1,
                    revenueChange: 23.5
                });
                setSessions([
                    { hash: 'abc123', name: 'Maria Silva', email: 'maria@email.com', status: 'analyzed', plan: 'basic', createdAt: new Date().toISOString() },
                    { hash: 'def456', name: 'João Santos', email: 'joao@email.com', status: 'analyzed', plan: 'premium', createdAt: new Date(Date.now() - 86400000).toISOString() },
                    { hash: 'ghi789', name: 'Ana Costa', status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
                ]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            // Demo data
            setStats({
                totalSessions: 47,
                totalAnalyzed: 32,
                totalRevenue: 287.53,
                emailsSent: 28,
                conversionRate: 68.1,
                revenueChange: 23.5
            });
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Nome', 'Email', 'Status', 'Plano', 'Data'];
        const rows = sessions.map(s => [
            s.name,
            s.email || '-',
            s.status,
            s.plan || '-',
            new Date(s.createdAt).toLocaleDateString('pt-BR')
        ]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ikigai-sessoes-${dateFilter}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const statCards = [
        {
            title: 'Total Sessões',
            value: stats.totalSessions,
            icon: Users,
            color: 'var(--color-skills)',
            change: null
        },
        {
            title: 'Análises Geradas',
            value: stats.totalAnalyzed,
            icon: FileText,
            color: 'var(--color-ikigai)',
            change: null
        },
        {
            title: 'Receita Total',
            value: `R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`,
            icon: DollarSign,
            color: 'var(--color-world)',
            change: stats.revenueChange
        },
        {
            title: 'Taxa Conversão',
            value: `${stats.conversionRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'var(--color-paid)',
            change: null
        }
    ];

    return (
        <main style={{
            background: 'var(--color-bg)',
            minHeight: '100vh',
            padding: 'var(--space-8)'
        }}>
            <div className="container" style={{ maxWidth: 1200 }}>
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
                            <BarChart3 size={28} style={{ display: 'inline', marginRight: 'var(--space-3)', color: 'var(--color-ikigai)' }} />
                            Dashboard Admin
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Visão geral das métricas do Ikigai
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        {/* Date Filter */}
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="input-premium"
                            style={{ width: 'auto', padding: 'var(--space-2) var(--space-4)' }}
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="all">Todo período</option>
                        </select>

                        <button onClick={fetchData} className="btn-secondary">
                            <RefreshCw size={18} />
                            Atualizar
                        </button>

                        <button onClick={handleExportCSV} className="btn-primary">
                            <Download size={18} />
                            Exportar CSV
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 'var(--space-6)',
                        marginBottom: 'var(--space-8)'
                    }}
                >
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="glass-card"
                            style={{ padding: 'var(--space-6)' }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--space-4)'
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 'var(--radius-lg)',
                                    background: `${card.color}20`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <card.icon size={24} color={card.color} />
                                </div>
                                {card.change !== null && (
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-1)',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: card.change >= 0 ? 'var(--color-world)' : 'var(--color-love)'
                                    }}>
                                        {card.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {Math.abs(card.change)}%
                                    </span>
                                )}
                            </div>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--color-text-muted)',
                                marginBottom: 'var(--space-1)'
                            }}>
                                {card.title}
                            </p>
                            <p style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: 'var(--color-text-primary)'
                            }}>
                                {card.value}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Sessions Table */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ delay: 0.3 }}
                    className="glass-card"
                    style={{ padding: 'var(--space-6)', overflow: 'hidden' }}
                >
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>
                        Sessões Recentes
                    </h3>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.9rem'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>Nome</th>
                                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>Email</th>
                                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>Plano</th>
                                    <th style={{ padding: 'var(--space-3)', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 500 }}>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((session, index) => (
                                    <tr
                                        key={session.hash}
                                        style={{
                                            borderBottom: index < sessions.length - 1 ? '1px solid var(--color-border)' : 'none'
                                        }}
                                    >
                                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
                                            {session.name}
                                        </td>
                                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
                                            {session.email || '-'}
                                        </td>
                                        <td style={{ padding: 'var(--space-3)' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                padding: 'var(--space-1) var(--space-2)',
                                                borderRadius: 'var(--radius-full)',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                background: session.status === 'analyzed'
                                                    ? 'rgba(149, 213, 178, 0.2)'
                                                    : 'rgba(255, 217, 61, 0.2)',
                                                color: session.status === 'analyzed'
                                                    ? 'var(--color-world)'
                                                    : 'var(--color-paid)'
                                            }}>
                                                {session.status === 'analyzed' ? 'Analisado' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)' }}>
                                            {session.plan ? (
                                                <span style={{
                                                    color: session.plan === 'premium'
                                                        ? 'var(--color-ikigai)'
                                                        : session.plan === 'lifetime'
                                                            ? 'var(--color-paid)'
                                                            : 'var(--color-skills)'
                                                }}>
                                                    {session.plan.charAt(0).toUpperCase() + session.plan.slice(1)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td style={{ padding: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
                                            {new Date(session.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {sessions.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--space-10)',
                            color: 'var(--color-text-muted)'
                        }}>
                            Nenhuma sessão encontrada
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
