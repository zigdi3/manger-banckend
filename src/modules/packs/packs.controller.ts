import { Body, Controller, Get, Param, Post, UseInterceptors, } from '@nestjs/common';
import { BigIntInterceptor } from 'src/shared/interceptors/big-int.interceptor';
import { PacksService } from './packs.service';

@Controller('packs')
@UseInterceptors(BigIntInterceptor)
export class PacksController {
  constructor(private service: PacksService) {

  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.getByPackId(id);
  }

  @Get(':packId')
  findPackId(@Param('packId') id: string) {
    return this.service.getByPackId(id);
  }
}