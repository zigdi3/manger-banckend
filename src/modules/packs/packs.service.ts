/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { packs } from '@prisma/client';
import { PacksRepository } from './packs.repository';

@Injectable()
export class PacksService {
  constructor(private service: PacksRepository) { }

  // async getById(id: string): Promise<packs[]> {
  //   return this.service.findById(id);
  // }

  async getPacketsById(id: string): Promise<packs[]> {
    return this.service.findPacketsById(id);
  }
}