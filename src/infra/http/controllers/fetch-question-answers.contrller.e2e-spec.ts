import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";
import request from "supertest";

describe("Fetch question answers (E2E)", () => {
  let app: INestApplication;
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

    studantFactory = app.get(StudantFactory);
    questionFactory = app.get(QuestionFactory);
    answerFactory = app.get(AnswerFactory);
    jwt = app.get(JwtService);

    await app.init();
  });

  it("[GET] /questions/:questionId/answers", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const result = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(result.statusCode).toEqual(200);
    expect(result.body.answers.length).toEqual(1);
  });
});
