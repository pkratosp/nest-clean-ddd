import { UniqueEntityID } from "@/core/entities/unique-entity";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client"

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment): QuestionComment {
        return QuestionComment.create({
            authorId: new UniqueEntityID(raw.authorId),
            content: raw.content,
            questionId: new UniqueEntityID(raw.authorId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(questionComment: QuestionComment): Prisma.CommentUncheckedCreateInput {
        return {
            authorId: questionComment.authorId.toString(),
            content: questionComment.content,
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
            id: questionComment.id.toString(),
        }
    }
}