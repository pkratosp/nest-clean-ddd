import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: string
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
