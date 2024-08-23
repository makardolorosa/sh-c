import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { createUserdto } from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: createUserdto): Promise<User> {
    const createduser = new this.userModel(user);
    return createduser.save();
  }
}
