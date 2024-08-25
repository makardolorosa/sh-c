import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserdto } from 'src/dtos/user.dto';
//import { createUserdto } from 'src/dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(private userservice: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createuserdto: createUserdto) {
    console.log(createuserdto);
    return this.userservice.createUser(createuserdto);
  }
}
