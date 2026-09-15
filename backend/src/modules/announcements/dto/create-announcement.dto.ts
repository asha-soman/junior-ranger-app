import {
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title!: string;

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsUUID()
    cohort_id!: string;

    @IsOptional()
    @IsIn(['draft', 'published'])
    status?: 'draft' | 'published';

    @IsOptional()
    @IsIn(['normal', 'high'])
    priority?: 'normal' | 'high';

    @IsOptional()
    @IsBoolean()
    is_pinned?: boolean;
}