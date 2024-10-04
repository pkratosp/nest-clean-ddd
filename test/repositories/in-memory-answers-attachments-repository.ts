import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswersAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
    const findAttachments = this.items.filter(
      (item) => item.answerId.toString() === questionId,
    );

    return findAttachments;
  }

  async deleteManyByAnswerId(questionId: string): Promise<void> {
    const findeAttachmentsForDelete = this.items.filter(
      (item) => item.answerId.toString() !== questionId,
    );

    this.items = findeAttachmentsForDelete;
  }
}
