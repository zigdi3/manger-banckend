import { PacksModule } from './modules/packs/packs.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from './modules/infra';
import { ProductsModule } from './modules/products/products.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformHTTPResponseInterceptor } from './shared/interceptors/http-transform.interceptor';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PrismaModule,
    ProductsModule,
    PacksModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformHTTPResponseInterceptor
    },
  ],
})
export class AppModule { }
