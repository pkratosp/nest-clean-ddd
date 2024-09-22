import { UniqueEntityID } from '@/core/entities/unique-entity';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
    static toDomain(raw: PrismaAnswer): Answer {
        return Answer.create({
            authorId: new UniqueEntityID(raw.authorId),
            content: raw.content,
            questionId: new UniqueEntityID(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }
    static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            authorId: answer.authorId.toString(),
            content: answer.content,
            questionId: answer.questionId.toString(),
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt
        }
    }
}