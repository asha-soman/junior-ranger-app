import {
    IsString,
    MaxLength,
    IsOptional,
    IsDateString,
    Matches,
} from 'class-validator';

export class UpdateClubActivityDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

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