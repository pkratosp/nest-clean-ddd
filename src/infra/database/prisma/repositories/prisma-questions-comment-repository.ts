import { Injectable } from "@nestjs/common";
import { QuestionCommentRepository } from "../../../../domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "../../../../domain/forum/enterprise/entities/question-comment";
import { PrismaService } from "../prisma-service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaQuestionsCommentRepository
  implements QuestionCommentRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByQuestionIdWithouAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {
    const questionsComments = await this.prismaService.comment.findMany({
      where: {
        questionId: questionId
      },
      include: {
        author: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      skip: (params.page - 1) * 20 
    })

    return questionsComments.map((questionComment) => PrismaCommentWithAuthorMapper.toDomain(questionComment))
  }

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
