import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { itemDto } from './cart-item.dto';

export class createCartdto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ValidateNested({ each: true })
  //@Type(() => ItemDto)
  items: itemDto[];

  @IsNumber()
  totalPrice: number;
}
