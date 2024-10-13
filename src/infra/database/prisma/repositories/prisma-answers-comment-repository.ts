import { Injectable } from "@nestjs/common";
import { AnswerCommentRepository } from "../../../../domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "../../../../domain/forum/enterprise/entities/answer-comment";
import { PrismaService } from "../prisma-service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswersCommentRepository implements AnswerCommentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByAnswerId(
    id: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answersComment = await this.prismaService.comment.findMany({
      where: {
        answerId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answersComment.map((answerComment) =>
      PrismaAnswerCommentMapper.toDomain(answerComment),
    );
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async create(data: AnswerComment): Promise<void> {
    const _data = PrismaAnswerCommentMapper.toPrisma(data);
    await this.prismaService.comment.create({
      data: _data,
    });
  }

  async delete(data: AnswerComment): Promise<void> {
    await this.prismaService.comment.delete({
      where: {
        id: data.id.toString(),
      },
    });
  }

  async findManyByAnswerIdWithAuthor(answerId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {
    const questionsComments = await this.prismaService.comment.findMany({
      where: {
        answerId: answerId
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
}
