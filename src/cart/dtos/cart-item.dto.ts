import { IsNumber, IsString } from 'class-validator';

export class itemDto {
  @IsString()
  productId: string;

  @IsString()
  itemName: string;

  @IsNumber()
  quantity: number;
}
