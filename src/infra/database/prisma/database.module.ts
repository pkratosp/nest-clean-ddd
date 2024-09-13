import { Module } from '@nestjs/common'
import { PrismaService } from './prisma-service'
import { PrismaAnswersAttachmentsRepository } from './repositories/prisma-answers-attachments-repository'
import { PrismaAnswersCommentRepository } from './repositories/prisma-answers-comment-repository'
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository'
import { PrimaNotificationRepository } from './repositories/prisma-notification-repository'
import { PrismaQuestionsAttachmentsRepository } from './repositories/prisma-questions-attachments-repository'
import { PrismaQuestionsCommentRepository } from './repositories/prisma-questions-comment-repository'
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswersAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrimaNotificationRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaQuestionsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswersAttachmentsRepository,
    PrismaAnswersCommentRepository,
    PrismaAnswersRepository,
    PrimaNotificationRepository,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaQuestionsRepository,
  ],
})
export class DatabaseModule {}