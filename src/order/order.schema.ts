import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { itemDto } from 'src/cart/dtos/cart-item.dto';
import { orderStatus } from 'src/enums/enum.order.status';

export type UserDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop([{ type: itemDto, required: false }])
  items?: itemDto[];

  @Prop({ type: Number })
  orderTotalPrice: number;

  @Prop({ type: String, enum: Object.values(orderStatus) })
  orderCurrentStatus: orderStatus;

  @Prop({ required: true })
  orderAdress: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
