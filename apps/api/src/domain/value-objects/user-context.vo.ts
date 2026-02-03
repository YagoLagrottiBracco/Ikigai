import { LifeStage } from '@ikigai/shared';

/**
 * Value Object: Contexto do usuário
 * Imutável após criação
 */
export class UserContext {
    constructor(
        public readonly name: string,
        public readonly age: number,
        public readonly currentProfession: string,
        public readonly educationArea: string,
        public readonly lifeStage: LifeStage,
        public readonly currentSituation: string,
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.name || this.name.trim().length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        if (this.age < 10 || this.age > 120) {
            throw new Error('Idade deve estar entre 10 e 120 anos');
        }
        if (!this.currentProfession || this.currentProfession.trim().length === 0) {
            throw new Error('Profissão atual é obrigatória');
        }
    }

    toPlainObject() {
        return {
            name: this.name,
            age: this.age,
            currentProfession: this.currentProfession,
            educationArea: this.educationArea,
            lifeStage: this.lifeStage,
            currentSituation: this.currentSituation,
        };
    }

    static fromPlainObject(obj: any): UserContext {
        return new UserContext(
            obj.name,
            obj.age,
            obj.currentProfession,
            obj.educationArea,
            obj.lifeStage,
            obj.currentSituation,
        );
    }
}
