import { Either, left, right } from '@/core/either'
import { AnswerCommentRepository } from '../repositories/answer-comment-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

type RequestType = {
  authorId: string
  answerId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentRepository) {}

  async execute({
    answerId,
    authorId,
  }: RequestType): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answer = await this.answerCommentRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(answer)

    return right(null)
  }
}
