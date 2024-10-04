import { StudantsRepository } from "@/domain/forum/application/repositories/studants-repository";
import { Studant } from "@/domain/forum/enterprise/entities/studants";
import { Injectable } from "@nestjs/common";
import { PrismaStudantsMapper } from "../mappers/prisma-studants-mapper";
import { PrismaService } from "../prisma-service";

@Injectable()
export class PrismaStudantsRepository implements StudantsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(studant: Studant): Promise<void> {
    const data = PrismaStudantsMapper.toPrisma(studant);

    await this.prismaService.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Studant | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaStudantsMapper.toDoamin(user);
  }
}
