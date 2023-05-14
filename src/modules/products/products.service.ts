import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { products } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private service: ProductsRepository) { }

  async getAll(): Promise<products[]> {
    return this.service.findAll();
  }

  async getById(id: string): Promise<products> {
    return this.service.findById(id);
  }

}
