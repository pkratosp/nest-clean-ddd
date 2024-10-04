import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export abstract class AnswerCommentRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract create(data: AnswerComment): Promise<void>;
  abstract delete(data: AnswerComment): Promise<void>;
  abstract findManyByAnswerId(
    id: string,
    page: PaginationParams,
  ): Promise<AnswerComment[]>;
}
