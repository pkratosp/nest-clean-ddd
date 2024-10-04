import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}) {
    const answer = makeAnswer(data);

    await this.prismaService.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
