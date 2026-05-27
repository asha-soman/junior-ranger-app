import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateInviteCodeDto {
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;
}
