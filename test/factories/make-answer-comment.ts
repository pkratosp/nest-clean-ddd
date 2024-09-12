import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const createAnswer = AnswerComment.create(
    {
      authorId: new UniqueEntityID().toString(),
      answerId: new UniqueEntityID().toString(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return createAnswer
}
