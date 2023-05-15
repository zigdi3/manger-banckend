import { BigIntInterceptor } from 'src/shared/interceptors/big-int.interceptor';
import { PacksRepository } from './packs.repository';
import { PacksService } from './packs.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
    imports: [],
    controllers: [],
    providers: [
        PacksService,
        PacksRepository,
        {
            provide: APP_INTERCEPTOR,
            useClass: BigIntInterceptor,
        },],
})
export class PacksModule { }
