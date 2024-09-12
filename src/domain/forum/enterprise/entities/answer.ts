import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreateEvent } from '../events/answer-create-event'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  get attachments() {
    return this.props.attachments
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    if (!id) {
      answer.addDomainEvents(new AnswerCreateEvent(answer))
    }

    return answer
  }
}
