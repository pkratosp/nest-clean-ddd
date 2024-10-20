import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { QuestionFactory } from "test/factories/make-question"
import { StudantFactory } from "test/factories/make-studant"
import { PrismaService } from "../database/prisma/prisma-service"
import { Test } from "@nestjs/testing"
import { DatabaseModule } from "../database/prisma/database.module"
import { AppModule } from "../app.module"
import request from 'supertest'
import { waitFor } from "test/utils/wait-for"

describe('On answer created (E2E)', async () => {

    let app: INestApplication;
    let prisma: PrismaService;
    let studantFactory: StudantFactory;
    let questionFactory: QuestionFactory;
    let jwt: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudantFactory, QuestionFactory],
        }).compile();
      
        app = moduleRef.createNestApplication();
    
        prisma = moduleRef.get(PrismaService);
        studantFactory = moduleRef.get(StudantFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        jwt = moduleRef.get(JwtService);
    
        await app.init();
    })

    it('should sen a notification when answer is created', async () => {

        const user = await studantFactory.makePrismaStudant();

        const token = jwt.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const questionId = question.id.toString();

        await request(app.getHttpServer())
            .post(`/questions/${questionId}/answer`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                content: "content answer",
                attachments: []
            });

        await waitFor(async () => {
            const notificationOnDatabase = await prisma.notifications.findFirst({
                where: {
                    recipentId: user.id.toString()
                }
            })

            expect(notificationOnDatabase).not.toBeNull()
        })

    })

})