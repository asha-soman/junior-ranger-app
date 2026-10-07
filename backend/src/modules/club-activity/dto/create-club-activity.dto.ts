import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    IsUUID,
    IsDateString,
    Matches,
} from 'class-validator';

export class CreateClubActivityDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    cohort_id!: string;

    @IsOptional()
    @IsString()
    @Matches(/^\/storage\/files\/[a-zA-Z0-9._-]+$/, {
        message: 'image_url must be a valid storage file path',
    })
    image_url?: string;

    @IsOptional()
    @IsDateString()
    activity_date?: string;
}