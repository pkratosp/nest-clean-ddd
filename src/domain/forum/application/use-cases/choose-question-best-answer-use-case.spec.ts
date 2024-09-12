import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer-use-case'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryAnswersAttachmentsRepository } from 'test/repositories/in-memory-answers-attachments-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository()
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswersAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    )

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(
      inMemoryQuestionsRepository.items[0].bestAnswerId?.toString(),
    ).toEqual(answer.id.toString())
  })

  it('should not be able to to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-000'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-001',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
