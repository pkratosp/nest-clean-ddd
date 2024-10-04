import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question } from "@/domain/forum/enterprise/entities/questions";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        title: raw.title,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      content: question.content,
      slug: question.slug.value,
      title: question.title,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId?.toString(),
    };
  }
}
