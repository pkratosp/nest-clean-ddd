import { Either, left, right } from '@/core/either'
import { AnswerRepository } from '../repositories/answer-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

type RequestType = {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute(data: RequestType): Promise<DeleteAnswerUseCaseResponse> {
    const findAnswer = await this.answerRepository.findbyId(data.answerId)

    if (!findAnswer) {
      return left(new ResourceNotFoundError())
    }

    if (data.authorId !== findAnswer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(findAnswer)

    return right(null)
  }
}
