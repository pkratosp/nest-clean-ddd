import { UniqueEntityID } from '@/core/entities/unique-entity'
import { DomainEvent } from '@/core/events/domain-event'
import { Answer } from '../entities/answer'

export class AnswerCreateEvent implements DomainEvent {
  public ocurrentAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurrentAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
