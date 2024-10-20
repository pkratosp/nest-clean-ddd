import { EventHandler } from "@/core/events/event-handler";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { SendNotificationUseCase } from "../use-cases/send-notification-use-case";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionBestAnswerChoose } from "@/domain/forum/enterprise/events/question-best-answer-choose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionBestAnswerChoosen implements EventHandler {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.execute.bind(this),
      QuestionBestAnswerChoose.name,
    );
  }

  private async execute({ question, bestAnswerId }: QuestionBestAnswerChoose) {
    const answer = await this.answerRepository.findbyId(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        title: "Sua resposta foi escolhida",
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat("...")}" foi escolhida pelo autor`,
        recipientId: answer.authorId.toString(),
      });
    }
  }
}
