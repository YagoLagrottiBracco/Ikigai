import { IsString, IsNumber, IsEnum, MinLength, Min, Max, IsOptional } from 'class-validator';
import { LifeStage, IkigaiContext } from '@ikigai/shared';

export class CreateSessionDto implements IkigaiContext {
    @IsString()
    @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    name: string;

    @IsNumber()
    @Min(10, { message: 'Idade mínima é 10 anos' })
    @Max(120, { message: 'Idade máxima é 120 anos' })
    age: number;

    @IsString()
    @MinLength(1, { message: 'Profissão atual é obrigatória' })
    currentProfession: string;

    @IsString()
    @IsOptional()
    educationArea: string;

    @IsEnum(['student', 'employed', 'unemployed', 'transition', 'retired'], {
        message: 'Estágio de vida inválido',
    })
    lifeStage: LifeStage;

    @IsString()
    @IsOptional()
    currentSituation: string;
}
