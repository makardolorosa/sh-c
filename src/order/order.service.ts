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

    // if (findUser.userCart.items.length === 0)
    // if ((await this.cartModel.findOne({ userId: id })).items.length === 0)
    //   throw new HttpException('Cart is empty', 403);
    console.log(findUser);
    const orderCart = await this.cartModel.findById(findUser.userCart);
    console.log(orderCart);
    const orderItemsList = orderCart.items;
    console.log(orderItemsList);
    const orderTotalprice = orderCart.totalPrice;

    const newOrder = await new this.orderModel({
      userId: id,
      orderAdress: orderDto.orderAdress,
      items: orderItemsList,
      orderTotalPrice: orderTotalprice,
      orderCurrentStatus: orderStatus.pending,
      isActive: true,
    });

    const savedOrder = await newOrder.save();

    //newOrder.updateOne({ $set: { items: orderItemsList } });

    await this.userModel.findByIdAndUpdate(
      id,
      { $push: { userOrders: savedOrder } },
      { new: true },
    );

    await this.cartModel.findOneAndUpdate(
      { userId: id },
      { $set: { items: new itemDto(), totalPrice: 0 } },
    );

    if (orderDto.saveAdress)
      await this.userModel.findByIdAndUpdate(id, {
        $set: { userAdress: orderDto.orderAdress },
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
  // if (findUser.userCart.items.length === 0)
  //   throw new HttpException('Cart is empty', 400);
  // console.log(newStatus);
  // console.log(orderStatus.awaiting_shipment);
  // let isActiveFlag = true;
  // if (newStatus === orderStatus.shipped) isActiveFlag = false;
  // let updatedOrder;
  // switch (newStatus) {
  //   case orderStatus.awaiting_shipment:
  //     updatedOrder = await this.orderModel.findByIdAndUpdate(
  //       orderId,
  //       { $set: { orderStatus: newStatus, isActive: isActiveFlag } },
  //       { new: true },
  //     );

  //     return updatedOrder;

  //   case orderStatus.pending:
  //     updatedOrder = await this.orderModel.findByIdAndUpdate(
  //       orderId,
  //       { $set: { orderStatus: newStatus, isActive: isActiveFlag } },
  //       { new: true },
  //     );

  //     return updatedOrder;

  //   case orderStatus.shipped:
  //     isActiveFlag = false;
  //     updatedOrder = await this.orderModel.findByIdAndUpdate(
  //       orderId,
  //       { $set: { orderStatus: newStatus, isActive: isActiveFlag } },
  //       { new: true },
  //     );

  //     return updatedOrder;

  //   default:
  //     throw new HttpException('Wrong status', 404);
  // }

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
