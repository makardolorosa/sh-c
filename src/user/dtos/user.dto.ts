import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Cart } from 'src/cart/cart.schema';

export class createUserdto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @ValidateNested()
  userCart?: Cart;
}
