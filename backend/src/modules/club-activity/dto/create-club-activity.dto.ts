import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MaxLength,
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
    @IsUrl({
        require_protocol: true,
    })
    image_url?: string;

    @IsOptional()
    @IsDateString()
    activity_date?: string;
}