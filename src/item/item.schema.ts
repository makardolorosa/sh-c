import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { iCategory } from 'src/enums/enum.item.category';

export type ProductDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  productArticle: string;

  @Prop()
  itemName: string;

  @Prop({ type: String })
  itemDescription: string;

  @Prop({ type: String, enum: Object.values(iCategory) })
  itemCategory: iCategory;

  @Prop({ type: Number })
  itemPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
