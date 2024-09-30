import { IsNumber, IsString } from 'class-validator';

export class itemDto {
  @IsString()
  productArticle: string;

  @IsNumber()
  quantity: number;
}
