import {
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class UpdateActivityPostDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    content?: string;

    @IsOptional()
    @IsString()
    @IsUrl({
        require_protocol: true,
    })
    image_url?: string;
}