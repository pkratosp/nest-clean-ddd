import { Module } from '@nestjs/common'

import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionController } from './controllers/fetch-recent-question.controller'
import { DatabaseModule } from '../database/prisma/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-question-use-case'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateStudantUseCase } from '@/domain/forum/application/use-cases/authenticate-studant-use-case'
import { RegisterStudantsUseCase } from '@/domain/forum/application/use-cases/register-studants-use-case'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug-use-case'
import { EditQuestionController } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
    GetQuestionBySlugController,
    EditQuestionController
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    AuthenticateStudantUseCase,
    RegisterStudantsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase
  ],
})
export class HttpModule {}
