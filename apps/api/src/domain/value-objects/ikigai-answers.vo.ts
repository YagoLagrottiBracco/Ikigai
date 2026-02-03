import { IkigaiAnswers } from '@ikigai/shared';

/**
 * Value Object: Respostas do Ikigai
 * Representa as respostas dos 4 pilares
 */
export class IkigaiAnswersVO {
    constructor(
        public readonly love: string[] = [],
        public readonly skills: string[] = [],
        public readonly worldNeeds: string[] = [],
        public readonly paidFor: string[] = [],
    ) { }

    /**
     * Verifica se todas as categorias têm pelo menos uma resposta
     */
    isComplete(): boolean {
        return (
            this.love.length > 0 &&
            this.skills.length > 0 &&
            this.worldNeeds.length > 0 &&
            this.paidFor.length > 0
        );
    }

    /**
     * Retorna o total de respostas
     */
    totalAnswers(): number {
        return (
            this.love.length +
            this.skills.length +
            this.worldNeeds.length +
            this.paidFor.length
        );
    }

    /**
     * Mescla com novas respostas parciais
     */
    merge(partial: Partial<IkigaiAnswers>): IkigaiAnswersVO {
        return new IkigaiAnswersVO(
            partial.love ?? this.love,
            partial.skills ?? this.skills,
            partial.worldNeeds ?? this.worldNeeds,
            partial.paidFor ?? this.paidFor,
        );
    }

    toPlainObject(): IkigaiAnswers {
        return {
            love: [...this.love],
            skills: [...this.skills],
            worldNeeds: [...this.worldNeeds],
            paidFor: [...this.paidFor],
        };
    }

    static fromPlainObject(obj: any): IkigaiAnswersVO {
        return new IkigaiAnswersVO(
            obj?.love ?? [],
            obj?.skills ?? [],
            obj?.worldNeeds ?? [],
            obj?.paidFor ?? [],
        );
    }

    static empty(): IkigaiAnswersVO {
        return new IkigaiAnswersVO();
    }
}
