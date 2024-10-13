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

describe("Edit Answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studantFactory: StudantFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentsFactory
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudantFactory, QuestionFactory, AnswerFactory, AttachmentFactory, AnswerAttachmentsFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studantFactory = moduleRef.get(StudantFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentsFactory)
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it("[PUT] /answers/:id", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });
    
    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachmens(),
      attachmentFactory.makePrismaAttachmens()
    ])

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();


    await Promise.all([
      answerAttachmentFactory.makePrismaAnswerAttachments({
        attachmentId: attachment1.id,
        answerId: answer.id
      }),
      answerAttachmentFactory.makePrismaAnswerAttachments({
        attachmentId: attachment2.id,
        answerId: answer.id
      })
    ])

    const attachment3 = await attachmentFactory.makePrismaAttachmens()

    const result = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "new content",
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ]
      });

    expect(result.statusCode).toEqual(200);

    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    });

    expect(answerOnDatabase?.content).toEqual("new content");


    const findAttachments = await prisma.attachment.findMany({
      where: {
        answerId: answerId.toString()
      }
    })

    const verifyDeleteAttachment = await prisma.attachment.findUnique({
      where: {
        id: attachment2.id.toString()
      }
    })

    expect(findAttachments).toHaveLength(2)
    expect(findAttachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id:attachment1.id.toString()
        }),
        expect.objectContaining({
          id:attachment3.id.toString()
        })
      ])
    )
    expect(verifyDeleteAttachment).toBeNull()
  });
});
