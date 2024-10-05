import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";

describe("Fetch recent answer comments (E2E)", () => {
  let app: INestApplication;
  let answerFactory: AnswerFactory;
  let studantFactory: StudantFactory;
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AnswerFactory, StudantFactory, AnswerCommentFactory,QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    answerFactory = moduleRef.get(AnswerFactory);
    studantFactory = moduleRef.get(StudantFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /answers/comments/:answerId", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id
    })

    const answer = await answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id
    });

    await Promise.all([
        answerCommentFactory.makePrismaAnswerComment({
            authorId: user.id,
            answerId: answer.id, 
        }),
        answerCommentFactory.makePrismaAnswerComment({
            authorId: user.id,
            answerId: answer.id, 
        })
    ])

    const response = await request(app.getHttpServer())
      .get(`/answers/comments/${answer.id.toString()}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.comments).toHaveLength(2);
  });
});
