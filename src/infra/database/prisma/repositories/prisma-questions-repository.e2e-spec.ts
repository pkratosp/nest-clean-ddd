import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository"
import { AppModule } from "@/infra/app.module"
import { CacheRepository } from "@/infra/cache/cacheRepository"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AttachmentFactory } from "test/factories/make-attachments"
import { QuestionFactory } from "test/factories/make-question"
import { QuestionAttachmentsFactory } from "test/factories/make-question-attachments"
import { StudantFactory } from "test/factories/make-studant"
import { DatabaseModule } from "../database.module"
import { CacheModule } from "@/infra/cache/cache.module"

describe('Prisma Questions Repository (E2E)', async () => {
    
    let app: INestApplication
    let studentFactory: StudantFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentsFactory
    let cacheRepository: CacheRepository
    let questionsRepository: QuestionRepository

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule,DatabaseModule,CacheModule],
            providers: [
                StudantFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentsFactory,
            ]
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudantFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentsFactory)
        cacheRepository = moduleRef.get(CacheRepository)
        questionsRepository = moduleRef.get(QuestionRepository)

        await app.init()
    })

    it('should cache question details', async () => {
        const user = await studentFactory.makePrismaStudant()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const attachment = await attachmentFactory.makePrismaAttachmens()

        await questionAttachmentFactory.makePrismaQuestionAttachments({
            attachmentId: attachment.id,
            questionId: question.id
        })

        const slug = question.slug.value

        const questionDetails = await questionsRepository.findDetailsBySlug(slug)

        const cached = await cacheRepository.get(`question:${slug}:details`)
        expect(cached).toEqual(JSON.stringify(questionDetails))
    })

    it('should return cached question details on subsequent calls', async () => {
        const user = await studentFactory.makePrismaStudant()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const attachment = await attachmentFactory.makePrismaAttachmens()

        await questionAttachmentFactory.makePrismaQuestionAttachments({
            attachmentId: attachment.id,
            questionId: question.id
        })

        const slug = question.slug.value

        await cacheRepository.set(
            `question:${slug}:details`,
            JSON.stringify({ empty: true })
        )

        const questionDetails = await questionsRepository.findDetailsBySlug(slug)

        expect(questionDetails).toEqual({ empty: true })
    })

    it('should reset question details cache when saving the question', async () => {
        const user = await studentFactory.makePrismaStudant()
    
        const question = await questionFactory.makePrismaQuestion({
          authorId: user.id,
        })
    
        const attachment = await attachmentFactory.makePrismaAttachmens()
    
        await questionAttachmentFactory.makePrismaQuestionAttachments({
          attachmentId: attachment.id,
          questionId: question.id,
        })
    
        const slug = question.slug.value
    
        await cacheRepository.set(
          `question:${slug}:details`,
          JSON.stringify({ empty: true }),
        )
    
        await questionsRepository.save(question)
    
        const cached = await cacheRepository.get(`question:${slug}:details`)
    
        expect(cached).toBeNull()
      })

})