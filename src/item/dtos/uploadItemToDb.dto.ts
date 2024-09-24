import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { iCategory } from 'src/enums/enum.item.category';

export class UploadItemDto {
  @IsString()
  @IsNotEmpty()
  productArticle: string;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @IsEnum(iCategory)
  @IsNotEmpty()
  itemCategory: iCategory;

  @IsNumber()
  @IsNotEmpty()
  itemPrice: number;
}
