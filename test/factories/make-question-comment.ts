import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = QuestionComment.create(
    {
      authorId: new UniqueEntityID().toString(),
      questionId: new UniqueEntityID().toString(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return createQuestion
}
