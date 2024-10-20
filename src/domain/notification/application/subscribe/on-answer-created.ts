import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { AnswerCreateEvent } from "@/domain/forum/enterprise/events/answer-create-event";
import { SendNotificationUseCase } from "../use-cases/send-notification-use-case";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.execute.bind(this), AnswerCreateEvent.name);
  }

  private async execute({ answer }: AnswerCreateEvent) {
    const question = await this.questionRepository.findbyId(
      answer.questionId.toString(),
    );

    if (question) {
      await this.sendNotificationUseCase.execute({
        title: `Nova resposta em "${question.title.substring(0, 40).concat("...")}"`,
        recipientId: question.authorId.toString(),
        content: answer.excerpt,
      });
    }
  }
}
