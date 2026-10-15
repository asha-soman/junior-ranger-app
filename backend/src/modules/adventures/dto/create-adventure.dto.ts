import { IsDateString, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAdventureDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    task_instructions!: string;

    @IsDateString()
    due_date!: string;

    @IsOptional()
    @IsString()
    image_url?: string;
}