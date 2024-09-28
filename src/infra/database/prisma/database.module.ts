import { Module } from '@nestjs/common'
import { PrismaService } from './prisma-service'

// implementação
import { PrismaAnswersAttachmentsRepository } from './repositories/prisma-answers-attachments-repository'
import { PrismaAnswersCommentRepository } from './repositories/prisma-answers-comment-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrimaNotificationRepository } from './repositories/prisma-notification-repository'
import { PrismaQuestionsAttachmentsRepository } from './repositories/prisma-questions-attachments-repository'
import { PrismaQuestionsCommentRepository } from './repositories/prisma-questions-comment-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'
import { PrismaStudantsRepository } from './repositories/prisma-studants-repository'

// repository (contratos)
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudantsRepository } from '@/domain/forum/application/repositories/studants-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerRepository } from '@/domain/forum/application/repositories/answer-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comment-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswersAttachmentsRepository
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswersCommentRepository
    },
    {
      provide: AnswerRepository,
      useClass: PrismaAnswersRepository
    },
    {
      provide: NotificationRepository,
      useClass: PrimaNotificationRepository
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionsAttachmentsRepository
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionsCommentRepository
    },
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudantsRepository,
      useClass: PrismaStudantsRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaAnswersAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrimaNotificationRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    QuestionRepository,
    StudantsRepository,
    AnswerAttachmentsRepository,
    AnswerCommentRepository,
    AnswerRepository,
    NotificationRepository,
    QuestionAttachmentsRepository,
    QuestionCommentRepository,
    QuestionRepository,
    StudantsRepository,
  ],
})
export class DatabaseModule {}
