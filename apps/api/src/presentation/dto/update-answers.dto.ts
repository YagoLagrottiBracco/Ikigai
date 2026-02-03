import { IsArray, IsOptional, IsString } from 'class-validator';
import { IkigaiAnswers } from '@ikigai/shared';

export class UpdateAnswersDto implements Partial<IkigaiAnswers> {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    love?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    skills?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    worldNeeds?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    paidFor?: string[];
}
