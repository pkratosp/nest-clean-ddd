import { PaginationParams } from '@/core/repositories/pagination-params'
import { Questions } from '../../enterprise/entities/questions'

export interface QuestionRepository {
  findbyId(id: string): Promise<Questions | null>
  findBySlug(slug: string): Promise<Questions | null>
  create(question: Questions): Promise<void>
  save(question: Questions): Promise<void>
  delete(question: Questions): Promise<void>
  findManyRecent(params: PaginationParams): Promise<Questions[]>
}
