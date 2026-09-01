import { IsNotEmpty } from 'class-validator';

export class UpdateUserProfileDto {
  @IsNotEmpty()
  name!: string;
}