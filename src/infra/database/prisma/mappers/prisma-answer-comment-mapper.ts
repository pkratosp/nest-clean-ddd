
import { Comment as PrismaComment, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
    static toDomain(raw: PrismaComment): AnswerComment {

        if(!raw.answerId) {
            throw new Error("Não possui answer id")
        }

        return AnswerComment.create({
            answerId: new UniqueEntityID(raw.answerId),
            authorId: new UniqueEntityID(raw.authorId),
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, 
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(answerComment: AnswerComment): Prisma.CommentUncheckedCreateInput {
        return {
            id: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
            answerId: answerComment.answerId.toString(),
            content: answerComment.content,
            createdAt: answerComment.createdAt,
            updatedAt: answerComment.updatedAt,
        }
    }
}