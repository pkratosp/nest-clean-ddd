import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  findById(id: string): Promise<QuestionComment | null>
  create(data: QuestionComment): Promise<void>
  delete(data: QuestionComment): Promise<void>
}
