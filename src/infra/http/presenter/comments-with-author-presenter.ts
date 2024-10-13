import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class CommentsWithAuthorPresenter {
    static toHttp(comment: CommentWithAuthor) {
        return {
            commentId: comment.commentId.toString(),
            content: comment.content,
            authorName: comment.author,
            authorId: comment.authorId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }
    }
}