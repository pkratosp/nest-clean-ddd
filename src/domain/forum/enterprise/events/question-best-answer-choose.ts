import { Question } from "../entities/questions";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { DomainEvent } from "@/core/events/domain-event";

export class QuestionBestAnswerChoose implements DomainEvent {
  public ocurrentAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurrentAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
