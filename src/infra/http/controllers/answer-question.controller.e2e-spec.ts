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
import { AttachmentFactory } from "test/factories/make-attachments";
import { AnswerAttachmentsFactory } from "test/factories/make-answer-attachments";

describe("Answer question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studantFactory: StudantFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentsFactory
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudantFactory, QuestionFactory, AnswerAttachmentsFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studantFactory = moduleRef.get(StudantFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentsFactory)
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it("[POST] /questions/:questionId/answer", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachmens()
    const attachment2 = await attachmentFactory.makePrismaAttachmens()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    const result = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answer`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "content answer",
        attachments: [
          attachment1.id.toString(),
          attachment2.id.toString()
        ]
      });

    expect(result.statusCode).toEqual(201);

    const answerOnDataBase = await prisma.answer.findFirst({
      where: {
        content: 'content answer'
      }
    })

    const findAttachmentByQuestion = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDataBase?.id
      }
    })

    expect(findAttachmentByQuestion).toHaveLength(2)
  });
});
