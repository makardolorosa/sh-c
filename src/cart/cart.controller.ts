import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { createCartdto } from './dtos/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createCart(@Body() createCartDto: createCartdto) {
    this.cartService.createCart(createCartDto);
  }
}
