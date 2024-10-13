import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachments(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return createQuestion;
}

@Injectable()
export class QuestionAttachmentsFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestionAttachments(data: Partial<QuestionAttachmentProps> = {}) {
    const _data = makeQuestionAttachments(data)
  
    await this.prismaService.attachment.update({
      where: {
        id: _data.attachmentId.toString()
      },
      data: {
        questionId: _data.questionId.toString()
      }
    })

    return _data
  }
}
