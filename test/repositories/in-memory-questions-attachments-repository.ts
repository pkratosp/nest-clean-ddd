import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionsAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const findAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return findAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const findeAttachmentsForDelete = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = findeAttachmentsForDelete;
  }
}
