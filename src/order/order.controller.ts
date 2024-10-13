import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post(':id')
  @UsePipes(new ValidationPipe())
  async createOrder() {}

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async getOrder() {}

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateOrder() {}

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async deleteOrder() {}
}
