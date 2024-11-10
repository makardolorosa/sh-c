import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthPayloadInfo {
  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;
}
