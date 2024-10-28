import { Injectable } from '@nestjs/common';
import { Item } from './item.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadItemDto } from './dtos/uploadItemToDb.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async uploadProducts(ItemsList: UploadItemDto[]) {
    ItemsList.forEach(async (item) => {
      const uploadedItem = new this.itemModel(item);
      await uploadedItem.save();
    });
  }

  async getItemList() {
    return this.itemModel.find();
  }
}
