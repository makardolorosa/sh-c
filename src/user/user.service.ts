import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { createUserdto } from 'src/user/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createduserdto: createUserdto): Promise<User> {
    const createduser = new this.userModel(createduserdto);
    return createduser.save();
  }

  getsUsers() {
    return this.userModel.find();
  }

  getsUserById(id: string) {
    return this.userModel.findById(id);
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
