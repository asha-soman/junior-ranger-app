import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    submission_text!: string;

    @IsOptional()
    @IsString()
    image_url?: string;
}