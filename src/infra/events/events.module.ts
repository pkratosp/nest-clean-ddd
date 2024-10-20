import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/prisma/database.module";
import { OnAnswerCreated } from "@/domain/notification/application/subscribe/on-answer-created";
import { OnQuestionBestAnswerChoosen } from "@/domain/notification/application/subscribe/on-question-best-answer-choosen";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification-use-case";

@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCreated,
        OnQuestionBestAnswerChoosen,
        SendNotificationUseCase
    ]
})
export class EventsModule {}