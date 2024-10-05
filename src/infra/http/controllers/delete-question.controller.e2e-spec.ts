import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";
import request from 'supertest';

describe('delete question (E2E)', () => {
    let app: INestApplication;
    let questionFactory: QuestionFactory;
    let studantFactory: StudantFactory;
    let jwt: JwtService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudantFactory, QuestionFactory],
          }).compile();
      
          app = moduleRef.createNestApplication();
      
          questionFactory = moduleRef.get(QuestionFactory);
          studantFactory = moduleRef.get(StudantFactory);
          jwt = moduleRef.get(JwtService);
          prisma = moduleRef.get(PrismaService);
      
          await app.init();
    })

    it('[DELETE] /questions/:id', async () => {

        const user = await studantFactory.makePrismaStudant()

        const token = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })


        const result = await request(app.getHttpServer())
            .delete(`/questions/${question.id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(result.statusCode).toEqual(204)
        

        const findQuestion = await prisma.question.findFirst({
            where: {
                id: question.id.toString()
            }
        })

        expect(findQuestion).toBeNull()
    })

})