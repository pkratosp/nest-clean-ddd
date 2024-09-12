import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  Questions,
  QuestionsProps,
} from '@/domain/forum/enterprise/entities/questions'

export function makeQuestion(
  override: Partial<QuestionsProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = Questions.create(
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
