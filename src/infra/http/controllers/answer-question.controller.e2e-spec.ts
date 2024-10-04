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

describe("Answer question (E2E)", () => {
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
  });

  it("[POST] /questions/:questionId/answer", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    const result = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answer`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "content answer",
      });

    expect(result.statusCode).toEqual(201);
  });
});
