import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  findbyId(id: string): Promise<Answer | null>
  create(data: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]>
}
