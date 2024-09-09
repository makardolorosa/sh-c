import { IsNumber, IsString } from 'class-validator';

export class itemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}
