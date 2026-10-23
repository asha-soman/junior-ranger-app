import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskCompletionDto {
  @IsOptional()
  @IsString()
  submission_text?: string;

  @IsOptional()
  @IsString()
  image_url?: string;
}