import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { createCartdto } from './dtos/create-cart.dto';
import { itemDto } from './dtos/cart-item.dto';
//import { itemDto } from './dtos/cart-item.dto';
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
    if (findUser.userCart)
      throw new HttpException('Cart is already created', 400);

    const createdCart = new this.cartModel(CreateCartdto);
    const savedCart = await createdCart.save();

    await findUser.updateOne({
      $set: {
        userCart: savedCart,
      },
    });

    return savedCart;
  }

  async updateCart(id: string, item: itemDto) {
    const tempItems = (await this.cartModel.findOne({ id })).items;
    const itemIndex = tempItems.findIndex(
      (exactItem) => exactItem.productId === item.productId,
    );

    if (itemIndex !== -1) {
      tempItems[itemIndex].quantity += item.quantity;
      if (tempItems[itemIndex].quantity < 0) tempItems[itemIndex].quantity = 0;
    } else {
      tempItems.push(item);
    }
    const result = tempItems.filter(
      (existedItems) => existedItems.quantity > 0,
    );

    console.log(result);
    const newCart = this.cartModel.findOneAndUpdate(
      { userId: id },
      { items: result },
      { new: true },
    );
    return newCart;
  }
}
