import { InMemoryQuestionsCommentRepository } from 'test/repositories/in-memory-questions-comment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question-use-case'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsCommentRepository: InMemoryQuestionsCommentRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question use case', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    inMemoryQuestionsCommentRepository =
      new InMemoryQuestionsCommentRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    inMemoryQuestionsRepository.create(question)

    await sut.execute({
      authorId: question.authorId.toString(),
      content: 'content comment',
      questionId: question.id.toString(),
    })

    expect(inMemoryQuestionsCommentRepository.items[0].content).toEqual(
      'content comment',
    )
  })
})
