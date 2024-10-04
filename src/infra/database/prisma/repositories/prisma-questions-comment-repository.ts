import { Injectable } from "@nestjs/common";
import { QuestionCommentRepository } from "../../../../domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "../../../../domain/forum/enterprise/entities/question-comment";
import { PrismaService } from "../prisma-service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionsCommentRepository
  implements QuestionCommentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const find = await this.prismaService.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!find) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(find);
  }

  async create(data: QuestionComment): Promise<void> {
    const _data = PrismaQuestionCommentMapper.toPrisma(data);

    await this.prismaService.comment.create({
      data: _data,
    });
  }

  async delete(data: QuestionComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: data.id.toString(),
      },
    });
  }
}
