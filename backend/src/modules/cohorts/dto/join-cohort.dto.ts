import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCohortDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
