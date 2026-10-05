import {
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';

export class UpdateActivityPostDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\/storage\/files\/[a-zA-Z0-9._-]+$/, {
        message: 'image_url must be a valid storage file path',
    })
    image_url?: string;
}