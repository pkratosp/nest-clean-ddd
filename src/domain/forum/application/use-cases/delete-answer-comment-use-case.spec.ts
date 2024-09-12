import { UniqueEntityID } from '@/core/entities/unique-entity'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment-use-case'
import { InMemoryAnswersCommentRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'

let inMemoryAnswersCommentRepository: InMemoryAnswersCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment use case', () => {
  beforeEach(() => {
    inMemoryAnswersCommentRepository = new InMemoryAnswersCommentRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswersCommentRepository)
  })

  it('should be able delete a answer comment', async () => {
    const _makeAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('authorid-01').toString(),
      },
      new UniqueEntityID('answerId-01'),
    )

    inMemoryAnswersCommentRepository.create(_makeAnswerComment)

    await sut.execute({
      authorId: 'authorid-01',
      answerId: 'answerId-01',
    })

    expect(inMemoryAnswersCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer comment from another user', async () => {
    const _makeAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('authorid-01').toString(),
      },
      new UniqueEntityID('answerId-01'),
    )

    inMemoryAnswersCommentRepository.create(_makeAnswerComment)

    const result = await sut.execute({
      authorId: 'authorid-02',
      answerId: 'answerId-01',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
