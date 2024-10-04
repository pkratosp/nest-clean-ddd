import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findbyId(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async create(data: Answer) {
    this.items.push(data);

    DomainEvents.dispatchEventsForAggregate(data.id);
  }

  async delete(answer: Answer) {
    const findIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(findIndex, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async save(answer: Answer) {
    const findIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[findIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
