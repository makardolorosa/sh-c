import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { UploadItemDto } from './dtos/uploadItemToDb.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  uploadProducts(@Body() itemsList: UploadItemDto[]) {
    return this.itemService.uploadProducts(itemsList);
  }
}
