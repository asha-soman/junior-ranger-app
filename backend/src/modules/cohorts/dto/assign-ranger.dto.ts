import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRangerDto {
  @IsUUID()
  @IsNotEmpty()
  rangerId!: string;
}