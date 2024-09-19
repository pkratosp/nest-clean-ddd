import { Module } from '@nestjs/common'
import { PrismaService } from './prisma-service'
import { PrismaAnswersAttachmentsRepository } from './repositories/prisma-answers-attachments-repository'
import { PrismaAnswersCommentRepository } from './repositories/prisma-answers-comment-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrimaNotificationRepository } from './repositories/prisma-notification-repository'
import { PrismaQuestionsAttachmentsRepository } from './repositories/prisma-questions-attachments-repository'
import { PrismaQuestionsCommentRepository } from './repositories/prisma-questions-comment-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { StudantsRepository } from '@/domain/forum/application/repositories/studants-repository'
import { PrismaStudantsRepository } from './repositories/prisma-studants-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswersAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrimaNotificationRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
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
  ],
})
export class DatabaseModule {}
