import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | null>
  create(data: AnswerComment): Promise<void>
  delete(data: AnswerComment): Promise<void>
}
