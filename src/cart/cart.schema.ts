import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { itemDto } from './dtos/cart-item.dto';
export type UserDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Number })
  totalPrice: number;

  @Prop([{ type: itemDto, required: false }])
  items?: itemDto[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
