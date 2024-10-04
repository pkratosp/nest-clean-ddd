import { UniqueEntityID } from "@/core/entities/unique-entity";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaAttachment } from "@prisma/client";

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
}
