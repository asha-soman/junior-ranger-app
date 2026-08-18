import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAdventureDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    task_instructions?: string;

    @IsOptional()
    @IsDateString()
    due_date?: string;

    @IsOptional()
    @IsIn(['draft', 'published', 'archived'])
    status?: 'draft' | 'published' | 'archived';
}