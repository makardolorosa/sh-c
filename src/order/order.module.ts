import { Module } from '@nestjs/common';
import { OrdersController } from './order.controller';
import { OrdersService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class OrdersModule {}
