import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";
import request from "supertest";
import { DatabaseModule } from "@/infra/database/prisma/database.module";

describe("Edit Answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studantFactory: StudantFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudantFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studantFactory = moduleRef.get(StudantFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it("[PUT] /answers/:id", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const result = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "new content",
      });

    expect(result.statusCode).toEqual(200);

    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    expect(answerOnDatabase?.content).toEqual("new content");
  });
});
