import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudantsRepository } from "./in-memory-studants-repository";

export class InMemoryAnswersCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = [];

  constructor(
    private studantyRepository: InMemoryStudantsRepository
  ) {}

  async create(data: AnswerComment) {
    this.items.push(data);
  }

  async findById(id: string) {
    const find = this.items.find((item) => item.id.toString() === id);

    return find ?? null;
  }

  async delete(data: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === data.id);

    this.items.splice(itemIndex, 1);
  }

  async findManyByAnswerId(id: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const answersComments = this.items
      .filter((item) => item.answerId.toString() === id)
      .slice((page - 1) * 20, page * 20);

    return answersComments;
  }

  async findManyByAnswerIdWithAuthor(id: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === id)
      .slice((page - 1) * 20, page * 20)
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

    return answerComments;
  }
}
