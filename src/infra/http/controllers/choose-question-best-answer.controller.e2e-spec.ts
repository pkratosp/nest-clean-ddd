import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";
import request from 'supertest'
import { AnswerFactory } from "test/factories/make-answer";

describe('choose question best answer (E2E)', () => {
    let app: INestApplication;
    let questionFactory: QuestionFactory;
    let studantFactory: StudantFactory;
    let answerFactory: AnswerFactory
    let jwt: JwtService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudantFactory, QuestionFactory,AnswerFactory],
          }).compile();
      
          app = moduleRef.createNestApplication();
      
          questionFactory = moduleRef.get(QuestionFactory);
          studantFactory = moduleRef.get(StudantFactory);
          answerFactory = moduleRef.get(AnswerFactory)
          jwt = moduleRef.get(JwtService);
          prisma = moduleRef.get(PrismaService);
      
          await app.init();
    })

    it('[PATCH] /answers/:answerId/choose-as-best', async () => {

        const user = await studantFactory.makePrismaStudant()

        const token = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
            questionId: question.id
        })

        const result = await request(app.getHttpServer())
            .patch(`/answers/${answer.id.toString()}/choose-as-best`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'comment in question'
            })

        expect(result.statusCode).toEqual(204)
        

        const findQuestion = await prisma.question.findFirst({
            where: {
                bestAnswerId: answer.id.toString()
            }
        })

        expect(findQuestion?.bestAnswerId).toEqual(answer.id.toString())
    })

})