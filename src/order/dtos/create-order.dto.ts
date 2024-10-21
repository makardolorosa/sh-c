import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createOrderDto {
  @IsNotEmpty()
  @IsString()
  orderAdress: string;

  @IsBoolean()
  @IsOptional()
  saveAdress?: boolean;
}
