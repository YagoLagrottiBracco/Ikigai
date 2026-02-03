import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
    title: 'Florir | Descubra Seu Propósito de Vida',
    description: 'Descubra sua razão de viver em minutos. Questionário + Análise por IA + Ranking de Carreiras + PDF personalizado. Baseado no método japonês Ikigai.',
    keywords: ['ikigai', 'propósito', 'carreira', 'autoconhecimento', 'vocação', 'orientação vocacional', 'teste vocacional', 'florir', 'propósito de vida'],
    authors: [{ name: 'Florir' }],
    creator: 'Florir',
    publisher: 'Florir',
    metadataBase: new URL('https://florir.online'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Florir | Descubra Seu Propósito de Vida',
        description: 'Encontre sua razão de viver através do método Ikigai. Análise por IA + Ranking de Carreiras.',
        type: 'website',
        locale: 'pt_BR',
        url: 'https://florir.online',
        siteName: 'Florir',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Florir - Descubra Seu Propósito',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Florir | Descubra Seu Propósito de Vida',
        description: 'Encontre sua razão de viver através do método Ikigai.',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.svg',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="min-h-screen antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
