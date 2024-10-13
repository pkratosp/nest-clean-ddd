import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract create(data: QuestionComment): Promise<void>;
  abstract delete(data: QuestionComment): Promise<void>;
  abstract findManyByQuestionIdWithouAuthor(questionId: string, params: PaginationParams): Promise<CommentWithAuthor[]>
}
