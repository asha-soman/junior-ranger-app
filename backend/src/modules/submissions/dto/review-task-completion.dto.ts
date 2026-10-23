import {
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReviewTaskCompletionDto {
  @IsIn(['approved', 'rejected'])
  status!: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  feedback?: string;
}