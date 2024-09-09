import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { itemDto } from './cart-item.dto';

export class createCartdto {
  @IsNotEmpty()
  @IsString()
  UserId: string;

  items: itemDto[];

  @IsNumber()
  totalprice: number;
}
