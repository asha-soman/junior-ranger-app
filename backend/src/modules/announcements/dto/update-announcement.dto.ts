import {
    IsBoolean,
    IsIn,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

export class UpdateAnnouncementDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsUUID()
    cohort_id?: string;

    @IsOptional()
    @IsIn(['draft', 'published', 'archived'])
    status?: 'draft' | 'published' | 'archived';

    @IsOptional()
    @IsIn(['normal', 'high'])
    priority?: 'normal' | 'high';

    @IsOptional()
    @IsBoolean()
    is_pinned?: boolean;
}