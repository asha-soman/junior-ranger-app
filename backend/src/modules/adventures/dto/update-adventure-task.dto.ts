import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateAdventureTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp_reward?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  task_order?: number;
}