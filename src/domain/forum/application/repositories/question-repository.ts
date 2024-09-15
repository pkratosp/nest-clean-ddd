import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/questions'

export abstract class QuestionRepository {
  abstract findbyId(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
}
