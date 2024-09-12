import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachments(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const createQuestion = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return createQuestion
}
