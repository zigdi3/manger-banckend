import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma.service';
import { packs } from '@prisma/client';

@Injectable()
export class PacksRepository {
  constructor(private repo: PrismaService) { }

  // async findById(id: string): Promise<packs[]> {

  //   const data = await this.repo.prisma.packs.findMany({
  //     where: {
  //       pack_id: BigInt(id)
  //     },
  //   })

  //   return data as packs[];
  // }
  async findPacketsById(packId: string): Promise<packs[]> {

    const data = await this.repo.prisma.packs.findMany({
      where: {
        pack_id: +packId
      },
    })

    return data as packs[];
  }
}