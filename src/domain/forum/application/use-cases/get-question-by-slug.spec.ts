import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlug } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionsAttachmentsRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlug

describe('Create question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new GetQuestionBySlug(inMemoryQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const createQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionsRepository.create(createQuestion)

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: createQuestion.title,
      }),
    })
  })
})
