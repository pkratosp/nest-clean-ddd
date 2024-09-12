import { Either, left, right } from '@/core/either'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

type RequestType = {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(data: RequestType): Promise<DeleteQuestionUseCaseResponse> {
    const findQuestion = await this.questionRepository.findbyId(data.questionId)

    if (!findQuestion) {
      return left(new ResourceNotFoundError())
    }

    if (data.authorId !== findQuestion.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(findQuestion)

    return right(null)
  }
}
