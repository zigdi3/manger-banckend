import { Injectable } from '@nestjs/common';
import { products, Prisma } from '@prisma/client';
import { PrismaService } from '../infra';

@Injectable()
export class ProductsRepository {
  constructor(private repo: PrismaService) { }

  async findById(code: string): Promise<products> {

    const data = await this.repo.prisma.products.findFirst({
      where: {
        code: +code
      },
    })

    return data as products;
  }

  async findAll(): Promise<products[]> {
    const data = await this.repo.prisma.products.findMany()

    return data as products[];
  }

  async update(product: products): Promise<products> {

    const data = await this.repo.prisma.products.update({
      where: {
        code: product.code
      },
      data: product
    })
    return data;
  }
}