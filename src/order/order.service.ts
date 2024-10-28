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
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createOrder(id: string, orderDto: createOrderDto) {
    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException('User not found', 404);

    // if (findUser.userCart.items.length === 0)
    if ((await this.cartModel.findOne({ userId: id })).items.length === 0)
      throw new HttpException('Cart is empty', 403);
    console.log(findUser);
    console.log(await this.cartModel.findById(findUser.userCart));
    const orderItemsList = (await this.cartModel.findById(findUser.userCart))
      .items;
    console.log(orderItemsList);
    const orderTotalprice = (await this.cartModel.findById(findUser.userCart))
      .totalPrice;

    const newOrder = await new this.orderModel({
      userId: id,
      orderAdress: orderDto.orderAdress,
      orderCart: orderItemsList,
      orderTotalPrice: orderTotalprice,
      orderCurrentStatus: orderStatus.pending,
      isActive: true,
    });

    findUser.updateOne({ $push: { userOrders: newOrder } });
    await this.cartModel.findOneAndUpdate(
      { userId: id },
      { $set: { items: new itemDto() } },
    );

    if (orderDto.saveAdress)
      this.userModel.findByIdAndUpdate(id, {
        $set: { userAdress: orderDto.orderAdress },
      });
    return newOrder.save();
  }

  async updateOrderStatus(newStatus: orderStatus, orderId: string) {
    // const findUser = await this.userModel.findById(userid);
    // if (!findUser) throw new HttpException('User not found', 404);

    // if (findUser.userCart.items.length === 0)
    //   throw new HttpException('Cart is empty', 400);

    let isActiveFlag = true;
    if (newStatus === orderStatus.shipped) isActiveFlag = false;

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { $set: { orderStatus: newStatus, isActive: isActiveFlag } },
      { new: true },
    );

    return updatedOrder;
  }

  async getUserOrders(userid: string) {
    const findUser = await this.orderModel.findById(userid);
    if (!findUser) throw new HttpException('User not found', 404);

    const findOrders = (await this.userModel.findById(userid)).userOrders;
    return findOrders;
  }

  async getOrderById(orderId: string) {
    const findOrder = await this.orderModel.findById(orderId);
    if (!findOrder) throw new HttpException('User not found', 404);

    return findOrder;
  }

  async deleteOrder(orderId: string) {
    const findOrder = await this.orderModel.findById(orderId);
    if (!findOrder) throw new HttpException('User not found', 404);

    const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
    return deletedOrder;
  }
}
