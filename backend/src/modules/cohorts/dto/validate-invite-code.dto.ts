import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateInviteCodeDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 12)
  code: string;
}
