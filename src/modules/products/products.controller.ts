import { Body, Controller, Get, Param, Post, UseInterceptors, } from '@nestjs/common';
import { ProductsService } from './products.service';
import { BigIntInterceptor } from 'src/shared/interceptors/big-int.interceptor';

@Controller('products')
//@UseInterceptors(BigIntInterceptor)
export class ProductsController {
  constructor(private service: ProductsService) {

  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':code')
  getById(@Param('code') productId: number) {
    return this.service.getById("" + productId);
  }

  @Post('/validar')
  validateImport(@Body() importedData: { base64Data: Buffer }) {
    return this.service.validateImport(importedData as any);
  }
}