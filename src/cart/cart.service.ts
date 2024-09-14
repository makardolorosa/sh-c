import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { createCartdto } from './dtos/create-cart.dto';
//import { createCartdto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createCart(CreateCartdto: createCartdto) {
    const findUser = await this.userModel.findById(CreateCartdto.userId);
    if (!findUser) throw new HttpException('User not found', 404);
    const createdCart = new this.cartModel(CreateCartdto);
    const savedCart = await createdCart.save();
    await findUser.updateOne({
      $set: {
        userCart: savedCart,
      },
    });
    return savedCart;
  }
}
