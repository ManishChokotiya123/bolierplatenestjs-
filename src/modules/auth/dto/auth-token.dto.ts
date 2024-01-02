import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthTokenDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
