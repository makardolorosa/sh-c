import { IsEnum } from 'class-validator';
import { orderStatus } from 'src/enums/enum.order.status';

export class updateOrderStatusDto {
  @IsEnum(orderStatus)
  newStatus: orderStatus;
}
