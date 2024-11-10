import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadInfo } from './dtos/login-user-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  loginUser(@Body() authPayloadInfo: AuthPayloadInfo) {
    return this.authService.validateUser(authPayloadInfo);
  }
}
