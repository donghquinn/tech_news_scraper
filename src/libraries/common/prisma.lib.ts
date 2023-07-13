import { PrismaClient } from '@prisma/client';

export class PrismaLibrary extends PrismaClient   {
  // private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();
  // }

  async onModuleInit() {
    await this.$connect();
  }

  async stopping() {
    await this.$disconnect();
  }
}
