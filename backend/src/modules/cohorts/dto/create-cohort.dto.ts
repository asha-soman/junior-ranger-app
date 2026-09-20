import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCohortDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location!: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}