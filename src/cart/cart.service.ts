import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { createCartdto } from './dtos/create-cart.dto';
import { itemDto } from './dtos/cart-item.dto';
import { Item } from 'src/item/item.schema';
//import { itemDto } from './dtos/cart-item.dto';
//import { createCartdto } from './dtos/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
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

  async updateCart(userId: string, item: itemDto) {
    const tempItems = (await this.cartModel.findOne({ userId: userId })).items;
    if (!tempItems) throw new HttpException('User not found', 404);
    const itemIndex = tempItems.findIndex(
      (exactItem) => exactItem.productArticle === item.productArticle,
    );

    if (!itemIndex) throw new HttpException('Item article not found', 403);
    const oldSum = (await this.cartModel.findOne({ userId: userId }))
      .totalPrice;

    let newSum = oldSum;
    if (itemIndex !== -1) {
      tempItems[itemIndex].quantity += item.quantity;
      newSum =
        oldSum +
        item.quantity *
          (
            await this.itemModel.findOne({
              productArticle: item.productArticle,
            })
          ).itemPrice;

      if (tempItems[itemIndex].quantity < 0) {
        const tempQuant = tempItems[itemIndex].quantity;
        newSum =
          oldSum +
          tempQuant *
            (
              await this.itemModel.findOne({
                productArticle: item.productArticle,
              })
            ).itemPrice;
        tempItems[itemIndex].quantity = 0;
      }
    } else {
      tempItems.push(item);
      newSum =
        oldSum +
        item.quantity *
          (
            await this.itemModel.findOne({
              productArticle: item.productArticle,
            })
          ).itemPrice;
    }

    const result = tempItems.filter(
      (existedItems) => existedItems.quantity > 0,
    );

    const newCart = this.cartModel.findOneAndUpdate(
      { userId: userId },
      { items: result, totalPrice: newSum },
      { new: true },
    );

    return newCart;
  }

  async getCartInfo(userId: string) {
    const cart = await this.cartModel.findOne({ userId: userId });

    return cart;
  }

  async deleteCart(userid: string) {
    console.log(userid);

    await this.cartModel.findOneAndDelete({
      userId: userid,
    });

    const tempCart = new createCartdto();
    tempCart.userId = userid;
    const createdCart = new this.cartModel(tempCart);
    const savedCart = await createdCart.save();

    const findUser = await this.userModel.findByIdAndUpdate(
      userid,
      { userCart: savedCart },
      { new: true },
    );

    return findUser;
  }
}
