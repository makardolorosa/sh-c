import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { User } from 'src/user/user.schema';
import { createOrderDto } from './dtos/create-order.dto';
import { Order } from './order.schema';
import { orderStatus } from 'src/enums/enum.order.status';
import { itemDto } from 'src/cart/dtos/cart-item.dto';
import { updateOrderStatusDto } from './dtos/update-order.dto';

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

    const findCart = await this.cartModel.findOne({ userId: id });
    if (findCart.items.length === 0)
      throw new HttpException('Cart is empty', 403);

    const orderCart = await this.cartModel.findById(findUser.userCart);
    const orderItemsList = orderCart.items;
    const orderTotalPrice = orderCart.totalPrice;

    const newOrder = await new this.orderModel({
      userId: id,
      orderAddress: orderDto.orderAddress,
      items: orderItemsList,
      orderTotalPrice: orderTotalPrice,
      orderCurrentStatus: orderStatus.pending,
      isActive: true,
    });
    const savedOrder = await newOrder.save();

    await this.userModel.findByIdAndUpdate(
      id,
      { $push: { userOrders: savedOrder } },
      { new: true },
    );

    await this.cartModel.findOneAndUpdate(
      { userId: id },
      { $set: { items: new itemDto(), totalPrice: 0 } },
    );

    if (orderDto.saveAddress)
      await this.userModel.findByIdAndUpdate(id, {
        $set: { userAddress: orderDto.orderAddress },
      });
    return savedOrder;
  }

  async updateOrderStatus(gotStatus: updateOrderStatusDto, orderId: string) {
    const findOrder = await this.orderModel.findById(orderId);
    if (!findOrder) throw new HttpException('Order not found', 404);

    let isActiveFlag = true;
    if (gotStatus.newStatus === orderStatus.shipped) isActiveFlag = false;

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { orderCurrentStatus: gotStatus.newStatus, isActive: isActiveFlag },
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
    if (!findOrder) throw new HttpException('Order not found', 404);

    return findOrder;
  }

  async deleteOrder(orderId: string) {
    const findOrder = await this.orderModel.findById(orderId);
    if (!findOrder) throw new HttpException('Order not found', 404);

    const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
    return deletedOrder;
  }
}
