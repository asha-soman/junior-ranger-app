import { IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateInviteCodeDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  max_usage?: number = 10;

  @IsDateString()
  @IsOptional()
  expiry_date?: string;
}
