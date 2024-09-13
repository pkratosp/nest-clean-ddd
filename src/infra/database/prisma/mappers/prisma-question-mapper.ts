import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question } from '@/domain/forum/enterprise/entities/questions'
import { Questions as PrismaQuestion } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        title: raw.title,
        bestAnswerId: undefined,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
