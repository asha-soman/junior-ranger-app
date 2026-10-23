import { IsOptional, IsString, IsUrl, IsObject } from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    submission_text!: string;

    @IsOptional()
    @IsUrl({ require_protocol: true, require_valid_protocol: true, protocols: ['https'] }, { message: 'image_url must be a valid, secure HTTPS URL' })
    image_url?: string;

    @IsOptional()
    @IsObject()
    image_metadata?: Record<string, any>;
}