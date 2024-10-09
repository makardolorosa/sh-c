import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Order } from 'src/order/order.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: false })
  userCart?: Cart;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }] })
  userOrders?: Order[];
  // @Prop()
  // id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
