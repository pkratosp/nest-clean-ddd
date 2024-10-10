import { UniqueEntityID } from "@/core/entities/unique-entity";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("chave não existe");
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentsId = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentsId
        }
      },
      data: {
        questionId: attachments[0].questionId.toString()
      }
    }
  }
}
