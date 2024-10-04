import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";

describe("Fetch recent question (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let studantFactory: StudantFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudantFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studantFactory = moduleRef.get(StudantFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        title: "Question 01",
        authorId: user.id,
      }),
      questionFactory.makePrismaQuestion({
        title: "Question 02",
        authorId: user.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: "Question 01" }),
        expect.objectContaining({ title: "Question 02" }),
      ]),
    });
  });
});
