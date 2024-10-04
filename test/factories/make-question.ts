import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  Question,
  QuestionsProps,
} from "@/domain/forum/enterprise/entities/questions";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";
import { Injectable } from "@nestjs/common";

export function makeQuestion(
  override: Partial<QuestionsProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return createQuestion;
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionsProps> = {}) {
    const question = makeQuestion(data);

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
