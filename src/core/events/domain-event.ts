import { UniqueEntityID } from '../entities/unique-entity'

export interface DomainEvent {
  ocurrentAt: Date
  getAggregateId(): UniqueEntityID
}
