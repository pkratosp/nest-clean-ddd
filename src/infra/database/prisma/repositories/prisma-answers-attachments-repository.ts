import { Injectable } from "@nestjs/common";
import { AnswerAttachmentsRepository } from "../../../../domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "../../../../domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "../prisma-service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswersAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.prismaService.attachment.findMany({
      where: {
        answerId: answerId,
      },
    });

    return answerAttachments.map((answerAttachment) =>
      PrismaAnswerAttachmentMapper.toDomain(answerAttachment),
    );
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {

    if(attachments.length === 0) {
      return
    } 

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)
    await this.prismaService.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {

    if(attachments.length === 0) {
      return
    }

    const attachmentsId = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsId
        }
      }
    })
  }
}
