import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCohortDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}