import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './dtos/create-order.dto';
import mongoose from 'mongoose';
import { orderStatus } from 'src/enums/enum.order.status';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post(':userId')
  @UsePipes(new ValidationPipe())
  async createNewOrder(
    @Param('userId') userId: string,
    @Body() orderDto: createOrderDto,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.orderService.createOrder(userId, orderDto);
  }

  @Get(':userId')
  @UsePipes(new ValidationPipe())
  async getOrders(@Param('userId') userId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.orderService.getUserOrders(userId);
  }

  @Get('/orderId/:orderId')
  @UsePipes(new ValidationPipe())
  async getOrderbyId(@Param('orderId') orderId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.orderService.getOrderById(orderId);
  }

  @Patch('/orderId/:orderId')
  @UsePipes(new ValidationPipe())
  async updateOrderstatus(
    @Param('orderId') orderId: string,
    @Body() newStatus: orderStatus,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.orderService.updateOrderStatus(newStatus, orderId);
  }

  @Delete('/orderId/:orderId')
  @UsePipes(new ValidationPipe())
  async deleteOrder(@Param('orderId') orderId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(orderId);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.orderService.deleteOrder(orderId);
  }
}
