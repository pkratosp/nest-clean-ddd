import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const createAnswer = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return createAnswer;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}) {
    const answerComment = makeAnswerComment(data);

    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
