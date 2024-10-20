import { Module } from "@nestjs/common";

import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionController } from "./controllers/fetch-recent-question.controller";
import { DatabaseModule } from "../database/prisma/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question-use-case";
import { FetchRecentQuestionUseCase } from "@/domain/forum/application/use-cases/fetch-recent-question-use-case";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateStudantUseCase } from "@/domain/forum/application/use-cases/authenticate-studant-use-case";
import { RegisterStudantsUseCase } from "@/domain/forum/application/use-cases/register-studants-use-case";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug-use-case";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question-use-case";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionsUseCase } from "@/domain/forum/application/use-cases/answer-questions-use-case";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer-use-case";
import { EditAnswerQuestionController } from "./controllers/edit-answer-question.controller";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer-use-case";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.contrller";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers-use-case";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question-use-case";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer-use-case";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer-use-case";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment-use-case";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment-use-case";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question-use-case";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchQuestionCommentUseCase } from "@/domain/forum/application/use-cases/fetch-question-comment-use-case";
import { FetchAnswerCommensController } from "./controllers/fetch-answer-comments.controller";
import { FetchAnswerCommentUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comment-use-case";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { StorageModule } from "../storage/storage.module";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment-use-case";
import { ReadNotificationController } from "./controllers/read-notification.controller";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification-use-case";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController,
    AnswerQuestionController,
    DeleteAnswerController,
    EditAnswerQuestionController,
    FetchQuestionAnswersController,
    CommentOnQuestionController,
    ChooseQuestionBestAnswerController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    DeleteQuestionCommentController,
    DeleteQuestionController,
    FetchQuestionCommentsController,
    FetchAnswerCommensController,
    UploadAttachmentController,
    ReadNotificationController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    AuthenticateStudantUseCase,
    RegisterStudantsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    AnswerQuestionsUseCase,
    DeleteAnswerUseCase,
    EditAnswerUseCase,
    FetchQuestionAnswersUseCase,
    CommentOnQuestionUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentUseCase,
    DeleteQuestionCommentUseCase,
    DeleteQuestionUseCase,
    FetchQuestionCommentUseCase,
    FetchAnswerCommentUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase
  ],
})
export class HttpModule {}
