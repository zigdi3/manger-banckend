import { ProductsService } from './products.service';
import { BigIntInterceptor } from 'src/shared/interceptors/big-int.interceptor';
import { Body, Controller, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';

@Controller('products')
@UseInterceptors(BigIntInterceptor)
export class ProductsController {
  constructor(private service: ProductsService) {

  }

  @Get()
  @HttpCode(200)
  getAll() {
    return this.service.getAll();
  }

  @Get(':code')
  getById(@Param('code') productId: number) {
    return this.service.getById("" + productId);
  }

  @Post('/validateForm')
  validateImport(@Body() importedData: { base64: Buffer }) {
    return this.service.validateImport(importedData as any);
  }
}