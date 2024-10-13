import { User as Studant, Comment } from "@prisma/client";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

type PrismaCommentWithAuthor = {
    author: Studant
} & Comment

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
        return CommentWithAuthor.create({
            author: raw.author.name,
            authorId: raw.author.id,
            commentId: raw.id,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        })
    }
}