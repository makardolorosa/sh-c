import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { User } from 'src/user/user.schema';
import { createOrderDto } from './dtos/create-order.dto';
import { Order } from './order.schema';
import { orderStatus } from 'src/enums/enum.order.status';
import { itemDto } from 'src/cart/dtos/cart-item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModule: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createOrder(id: string, orderDto: createOrderDto) {
    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException('User not found', 404);

    if (findUser.userCart.items.length === 0)
      throw new HttpException('Cart is empty', 403);

    const newOrder = await new this.orderModule({
      userId: id,
      orderAdress: orderDto.orderAdress,
      orderCart: findUser.userCart.items,
      orderTotalPrice: findUser.userCart.totalPrice,
      orderCurrentStatus: orderStatus.pending,
      isActive: true,
    });

    findUser.updateOne({ $push: { userOrders: newOrder } }, { new: true });
    await this.cartModel.findOneAndUpdate(
      { userId: id },
      { items: new itemDto() },
    );

    if (orderDto.saveAdress)
      this.userModel.findByIdAndUpdate(id, {
        $set: { userAdress: orderDto.orderAdress },
      });
    return newOrder.save();
  }

  async updateOrderStatus(newStatus: orderStatus, userid: string) {
    const findUser = await this.userModel.findById(userid);
    if (!findUser) throw new HttpException('User not found', 404);

    if (findUser.userCart.items.length === 0)
      throw new HttpException('Cart is empty', 400);

    const updatedOrder = this.orderModule.findOneAndUpdate(
      { userId: userid },
      { $set: { orderStatus: newStatus } },
      { new: true },
    );

    return updatedOrder;
  }

  async getOrder(userid: string) {
    const fin;
  }
}
