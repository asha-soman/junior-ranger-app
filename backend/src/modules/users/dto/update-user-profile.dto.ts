import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}