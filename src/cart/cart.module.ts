import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class CartModule {}
