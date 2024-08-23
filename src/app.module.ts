import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    OrdersModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  controllers: [AppController, OrdersController],
  providers: [AppService, OrdersService, UserService],
})
export class AppModule {}
