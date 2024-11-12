import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadInfo } from './dtos/login-user-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  loginUser(@Body() authPayloadInfo: AuthPayloadInfo) {
    return this.authService.validateUser(authPayloadInfo);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Req() req: Request) {
    return req.user;
  }
}
