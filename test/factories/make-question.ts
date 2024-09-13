import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  Question,
  QuestionsProps,
} from '@/domain/forum/enterprise/entities/questions'

export function makeQuestion(
  override: Partial<QuestionsProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return createQuestion
}
