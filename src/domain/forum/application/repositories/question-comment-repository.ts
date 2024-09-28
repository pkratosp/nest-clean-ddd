import { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract create(data: QuestionComment): Promise<void>
  abstract delete(data: QuestionComment): Promise<void>
}
