import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MaxLength,
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
    @IsUrl({
        require_protocol: true,
    })
    image_url?: string;
}