import { IkigaiSession, IkigaiContext, IkigaiAnswers, CreateSessionResponse } from '@ikigai/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${API_URL}/api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async createSession(context: IkigaiContext): Promise<CreateSessionResponse> {
        return this.fetch<CreateSessionResponse>('/sessions', {
            method: 'POST',
            body: JSON.stringify(context),
        });
    }

    async getSession(hash: string): Promise<IkigaiSession> {
        return this.fetch<IkigaiSession>(`/sessions/${hash}`);
    }

    async updateAnswers(hash: string, answers: Partial<IkigaiAnswers>): Promise<IkigaiSession> {
        return this.fetch<IkigaiSession>(`/sessions/${hash}/answers`, {
            method: 'PATCH',
            body: JSON.stringify(answers),
        });
    }

    async analyzeSession(hash: string): Promise<IkigaiSession> {
        return this.fetch<IkigaiSession>(`/sessions/${hash}/analyze`, {
            method: 'POST',
        });
    }

    getPdfUrl(hash: string): string {
        return `${API_URL}/api/sessions/${hash}/pdf`;
    }
}

export const api = new ApiClient();
