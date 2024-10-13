import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { orderStatus } from 'src/enums/enum.order.status';

export type UserDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: false })
  orderCart?: Cart;

  @Prop({ type: String, enum: Object.values(orderStatus) })
  orderCurrentStatus: orderStatus;
  // @Prop()
  // id: string;
  @Prop({ required: true })
  orderAdress: string;
}

export const UserSchema = SchemaFactory.createForClass(Order);
