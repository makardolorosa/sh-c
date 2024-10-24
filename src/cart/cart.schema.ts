import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { itemDto } from './dtos/cart-item.dto';
export type UserDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Number, default: 0 })
  totalPrice: number;

  @Prop([{ type: itemDto, required: false, default: new itemDto() }])
  items?: itemDto[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
