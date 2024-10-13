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

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }
  
  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = answerAttachments;
  }
}
