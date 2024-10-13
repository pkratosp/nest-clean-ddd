import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachments(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const createAnswer = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return createAnswer;
}

@Injectable()
export class AnswerAttachmentsFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerAttachments(data: Partial<AnswerAttachmentProps> = {}) {
    const _data = makeAnswerAttachments(data)

    await this.prismaService.attachment.update({
      where: {
        id: _data.attachmentId.toString()
      },
      data: {
        answerId: _data.answerId.toString()
      }
    })

    return _data
  }
}