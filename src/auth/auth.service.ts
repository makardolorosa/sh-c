import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { AuthPayloadInfo } from './dtos/login-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginInfo: AuthPayloadInfo) {
    const FindUserByEmail = await this.userModel.findOne({
      email: loginInfo.email,
    });
    if (!FindUserByEmail)
      throw new HttpException('Wrong Login credentials', 401);

    if (loginInfo.password === FindUserByEmail.password) {
      const payload = { sub: FindUserByEmail.id, email: FindUserByEmail.email };

      return this.jwtService.sign(payload);
    } else throw new HttpException('Wrong Login credentials', 401);
  }
}
