import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  start_time!: string;

  @IsDateString()
  end_time!: string;

  @IsOptional()
  @IsDateString()
  registration_deadline?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsUUID()
  cohort_id!: string;
}