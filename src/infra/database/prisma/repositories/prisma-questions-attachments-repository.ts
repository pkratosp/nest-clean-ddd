import { Injectable } from "@nestjs/common";
import { QuestionAttachmentsRepository } from "../../../../domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "../../../../domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "../prisma-service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questions = await this.prismaService.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questions.map((question) =>
      PrismaQuestionAttachmentMapper.toDomain(question),
    );
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
