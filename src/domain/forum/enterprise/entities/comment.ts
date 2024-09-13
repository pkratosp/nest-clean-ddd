import { Entity } from '@/core/entities/entity'

export interface CommentProps {
  authorId: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Comment<Props extends CommentProps> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
  }
}