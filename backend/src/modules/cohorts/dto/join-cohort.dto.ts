import { IsString, Length } from 'class-validator';

export class JoinCohortDto {
  @IsString()
  @Length(8, 8, { message: 'Invite code must be exactly 8 characters' })
  code: string;
}
