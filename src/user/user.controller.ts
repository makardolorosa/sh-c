import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserdto } from 'src/user/dtos/user.dto';
import mongoose from 'mongoose';
//import { createUserdto } from 'src/dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: createUserdto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getsUsers();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getUserById(@Param('id') id: string) {
    const IsValid = mongoose.Types.ObjectId.isValid(id);
    if (!IsValid) throw new HttpException('User not found', 404);
    const findUser = await this.usersService.getsUserById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return findUser;
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteUser(@Param('id') id: string) {
    const IsValid = mongoose.Types.ObjectId.isValid(id);
    if (!IsValid) throw new HttpException('User not found', 404);
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) throw new HttpException('User not found', 400);
  }
}
