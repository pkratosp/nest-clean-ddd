import { Either, left, right } from '@/core/either'
import { Questions } from '../../enterprise/entities/questions'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'

type RequestType = {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Questions
  }
>

export class GetQuestionBySlug {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ slug }: RequestType): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    return right({
      question,
    })
  }
}
