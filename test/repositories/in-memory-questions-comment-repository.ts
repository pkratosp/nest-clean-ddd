import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionsCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = [];

  async create(data: QuestionComment) {
    this.items.push(data);
  }

  async findById(id: string) {
    const find = this.items.find((item) => item.id.toString() === id);

    return find ?? null;
  }

  async delete(data: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === data.id);

    this.items.splice(itemIndex, 1);
  }


  async findManyByQuestionIdWithouAuthor(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20);

    return questionsComments;
  }
}
