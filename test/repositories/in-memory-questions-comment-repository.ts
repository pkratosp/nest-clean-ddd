import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudantsRepository } from "./in-memory-studants-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionsCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = [];

  constructor(
    private studantyRepository: InMemoryStudantsRepository
  ) {}

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


  async findManyByQuestionIdWithouAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]> {
    const questionsComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map(comment => {

        const author = this.studantyRepository.items.find((studant) => {
          return studant.id.equals(comment.authorId)
        })

        if(!author) {
          throw new Error(`Author id ${comment.authorId} does not exists`)
        }

        return CommentWithAuthor.create({
          author: author.name,
          authorId: author.id.toString(),
          commentId: comment.id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt
        })
      })

    return questionsComments;
  }
}
