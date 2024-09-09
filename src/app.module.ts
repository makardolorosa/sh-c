import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { OrdersModule } from './order/orders.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://antonenkomakar123:KQ6LdnQK7FK6aE7z@cluster0.mmmhp.mongodb.net/',
    ),
    UserModule,
    //OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
