import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerRepository } from '../repositories/answer-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

type RequestType = {
  instructorId: string
  questionId: string
  content: string
  attachments: string[]
}

type AnswerQuestionsUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionsUseCase {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async execute({
    content,
    instructorId,
    questionId,
    attachments,
  }: RequestType): Promise<AnswerQuestionsUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    const answerAttachments = attachments.map((attachment) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachment),
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
