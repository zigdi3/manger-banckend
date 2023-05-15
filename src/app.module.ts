import { PacksModule } from './modules/packs/packs.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from './modules/infra';
import { ProductsModule } from './modules/products/products.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PrismaModule,
    ProductsModule,
    PacksModule
  ]
})
export class AppModule { }
