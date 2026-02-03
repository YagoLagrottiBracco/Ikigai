import { IkigaiSessionEntity } from '../entities/ikigai-session.entity';

/**
 * Interface do Repositório de Sessões
 * Abstração para persistência (DDD)
 */
export interface ISessionRepository {
    /**
     * Cria uma nova sessão
     */
    create(session: IkigaiSessionEntity): Promise<IkigaiSessionEntity>;

    /**
     * Busca sessão pelo hash único
     */
    findByHash(hash: string): Promise<IkigaiSessionEntity | null>;

    /**
     * Atualiza uma sessão existente
     */
    update(session: IkigaiSessionEntity): Promise<IkigaiSessionEntity>;

    /**
     * Verifica se um hash já existe
     */
    hashExists(hash: string): Promise<boolean>;
}

export const SESSION_REPOSITORY = Symbol('ISessionRepository');
