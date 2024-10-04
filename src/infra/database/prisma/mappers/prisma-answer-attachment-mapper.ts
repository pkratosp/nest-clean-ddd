import { UniqueEntityID } from "@/core/entities/unique-entity";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("Chave não existe");
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
