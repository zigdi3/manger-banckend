import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BigIntInterceptor } from 'src/shared/interceptors/big-int.interceptor';
import { PacksService } from './packs.service';

@Controller('packs')
@UseInterceptors(BigIntInterceptor)
export class PacksController {
  constructor(private service: PacksService) {

  }

  @Get(':id')
  findByPackId(@Param('id') id: string) {
    return this.service.getPacketsById(id);
  }

}