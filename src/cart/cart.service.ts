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
  async updateCurrentTotalPrice(cart: Cart) {
    cart.items.forEach(async (item) => {
      const TempArt = item.productArticle;
      const tempItem = await this.itemModel.findOne({ TempArt });
      cart.totalPrice = cart.totalPrice + tempItem.itemPrice;
    });
  }

  async updateCart(UserId: string, item: itemDto) {
    const tempItems = (await this.cartModel.findOne({ UserId })).items;
    const itemIndex = tempItems.findIndex(
      (exactItem) => exactItem.productArticle === item.productArticle,
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

    const newSum =
      (await this.cartModel.findOne({ UserId })).totalPrice +
      item.quantity *
        (await this.itemModel.findOne({ productArticle: item.productArticle }))
          .itemPrice;

    console.log(result);
    const newCart = this.cartModel.findOneAndUpdate(
      { userId: UserId },
      { items: result, totalPrice: newSum },
      { new: true },
    );

    // this.updateCurrentTotalPrice(await newCart);
    console.log(newCart);
    return newCart;
  }
}
