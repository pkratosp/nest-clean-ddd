import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachments(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const createAnswer = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return createAnswer
}
