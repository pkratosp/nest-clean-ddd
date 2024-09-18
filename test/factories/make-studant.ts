import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  Studant,
  StudantsProps,
} from '@/domain/forum/enterprise/entities/studants'
import { faker } from '@faker-js/faker'

export function makeStudant(
  override: Partial<StudantsProps> = {},
  id?: UniqueEntityID,
) {
  const createStudant = Studant.create(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return createStudant
}
