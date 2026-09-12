import {
    IsDateString,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
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
    @IsUrl({
        require_protocol: true,
    })
    image_url?: string;

    @IsOptional()
    @IsDateString()
    activity_date?: string;
}