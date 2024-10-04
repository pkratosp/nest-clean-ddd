import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Studant } from "@/domain/forum/enterprise/entities/studants";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaStudantsMapper {
  static toDoamin(raw: PrismaUser): Studant {
    return Studant.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(studant: Studant): Prisma.UserUncheckedCreateInput {
    return {
      email: studant.email,
      name: studant.name,
      password: studant.password,
      id: studant.id.toString(),
      role: "STUDENT",
    };
  }
}
