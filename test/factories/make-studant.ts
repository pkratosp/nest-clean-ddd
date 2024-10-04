import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  Studant,
  StudantsProps,
} from "@/domain/forum/enterprise/entities/studants";
import { PrismaStudantsMapper } from "@/infra/database/prisma/mappers/prisma-studants-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeStudant(
  override: Partial<StudantsProps> = {},
  id?: UniqueEntityID,
) {
  const createStudant = Studant.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return createStudant;
}

@Injectable()
export class StudantFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaStudant(data: Partial<StudantsProps> = {}) {
    const studant = makeStudant(data);

    await this.prismaService.user.create({
      data: PrismaStudantsMapper.toPrisma(studant),
    });

    return studant;
  }
}
