import { Either, right } from '@/core/either'
import { Questions } from '../../enterprise/entities/questions'
import { QuestionRepository } from '../repositories/question-repository'

type RequestType = {
  page: number
}

type FetchRecentQuestionUseCaseResponse = Either<
  null,
  {
    questions: Questions[]
  }
>

export class FetchRecentQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: RequestType): Promise<FetchRecentQuestionUseCaseResponse> {
    const find = await this.questionRepository.findManyRecent({ page })

    return right({
      questions: find,
    })
  }
}
