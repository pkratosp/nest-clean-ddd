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

describe('comment on question (E2E)', () => {
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

    it('[POST] /questions/:questionId/comments', async () => {

        const user = await studantFactory.makePrismaStudant()

        const token = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const result = await request(app.getHttpServer())
            .post(`/questions/${question.id.toString()}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'comment in question'
            })

        expect(result.statusCode).toEqual(201)
        

        const findQuestionComment = await prisma.comment.findFirst({
            where: {
                questionId: question.id.toString()
            }
        })

        expect(findQuestionComment?.content).toEqual('comment in question')
    })

})