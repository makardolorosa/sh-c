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
import { CartService } from './cart.service';
import { createCartdto } from './dtos/create-cart.dto';
import { itemDto } from './dtos/cart-item.dto';
import mongoose from 'mongoose';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createCart(@Body() createCartDto: createCartdto) {
    this.cartService.createCart(createCartDto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  updateCartById(@Param('id') id: string, @Body() updateItemCart: itemDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);

    return this.cartService.updateCart(id, updateItemCart);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  getCartById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    console.log(id);
    return this.cartService.getCartInfo(id);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteCartById(@Param() userId: string) {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) throw new HttpException('Invalid ID', 400);
    console.log(userId);
    return this.cartService.deleteCart(userId);
  }
}
