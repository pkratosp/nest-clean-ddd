import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";

describe("get question by slug (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studantFactory: StudantFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudantFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studantFactory = moduleRef.get(StudantFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    await questionFactory.makePrismaQuestion({
      title: "Question 01",
      slug: Slug.create("question-01"),
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .get("/questions/question-01")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: "Question 01" }),
    });
  });
});
