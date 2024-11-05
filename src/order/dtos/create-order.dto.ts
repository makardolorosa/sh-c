import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createOrderDto {
  @IsNotEmpty()
  @IsString()
  orderAddress: string;

  @IsBoolean()
  @IsOptional()
  saveAddress?: boolean;
}
