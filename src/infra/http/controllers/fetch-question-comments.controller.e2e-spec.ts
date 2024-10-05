import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudantFactory } from "test/factories/make-studant";

describe("Fetch recent question comments (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let studantFactory: StudantFactory;
  let questionCommentFactory: QuestionCommentFactory
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudantFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studantFactory = moduleRef.get(StudantFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions/commnets/:questionId", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
        authorId: user.id,
    });

    await Promise.all([
        questionCommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id, 
        }),
        questionCommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id, 
        })
    ])

    const response = await request(app.getHttpServer())
      .get(`/questions/commnets/${question.id.toString()}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.comments).toHaveLength(2);
  });
});
