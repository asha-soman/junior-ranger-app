import { IsEmail, IsIn, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  name!: string;

  @MinLength(6)
  password!: string;

  @IsIn(['ranger', 'junior_ranger'])
  role!: 'ranger' | 'junior_ranger';
}