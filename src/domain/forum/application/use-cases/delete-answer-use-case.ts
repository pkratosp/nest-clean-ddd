import { Either, left, right } from '@/core/either'
import { AnswerRepository } from '../repositories/answer-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

type RequestType = {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute(data: RequestType): Promise<DeleteAnswerUseCaseResponse> {
    const findQuestion = await this.answerRepository.findbyId(data.answerId)

    if (!findQuestion) {
      return left(new ResourceNotFoundError())
    }

    if (data.authorId !== findQuestion.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(findQuestion)

    return right(null)
  }
}
