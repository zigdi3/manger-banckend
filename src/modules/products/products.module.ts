import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { BigIntInterceptor } from '../../shared/interceptors/big-int.interceptor';

@Module({
    imports: [],
    controllers: [
        ProductsController,],
    providers: [
        ProductsRepository,
        ProductsService,
        {
            provide: APP_INTERCEPTOR,
            useClass: BigIntInterceptor,
        },
    ],
})
export class ProductsModule { }
