import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://antonenkomakar123:KQ6LdnQK7FK6aE7z@cluster0.mmmhp.mongodb.net/',
    ),
    UserModule,
    CartModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
