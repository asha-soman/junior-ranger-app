import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Matches,
} from 'class-validator';

export class CreateActivityPostDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    content!: string;

    @IsUUID()
    cohort_id!: string;

    @IsOptional()
    @IsString()
    @Matches(/^\/storage\/files\/[a-zA-Z0-9._-]+$/, {
        message: 'image_url must be a valid storage file path',
    })
    image_url?: string;
}