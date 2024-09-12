import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'

type RequestType = {
  questionId: string
  page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    page,
    questionId,
  }: RequestType): Promise<FetchQuestionAnswersUseCaseResponse> {
    const findAnswers = await this.answerRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({
      answers: findAnswers,
    })
  }
}
