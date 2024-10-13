import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { QuestionFactory } from "test/factories/make-question";
import { StudantFactory } from "test/factories/make-studant";
import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { QuestionAttachmentsFactory } from "test/factories/make-question-attachments";
import { AttachmentFactory } from "test/factories/make-attachments";

describe("Edit question (E2E)", () => {
  let app: INestApplication;
  let questionFactory: QuestionFactory;
  let studantFactory: StudantFactory;
  let questionAttachmentsFactory: QuestionAttachmentsFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudantFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentsFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    questionFactory = moduleRef.get(QuestionFactory);
    studantFactory = moduleRef.get(StudantFactory);
    questionAttachmentsFactory = moduleRef.get(QuestionAttachmentsFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[PUT] /questions/:id", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const [attachment1, attachment2] = await Promise.all([
      attachmentFactory.makePrismaAttachmens(),
      attachmentFactory.makePrismaAttachmens()
    ])

    const { id: questionId } = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await Promise.all([
      questionAttachmentsFactory.makePrismaQuestionAttachments({
        attachmentId: attachment1.id,
        questionId: questionId
      }),
      questionAttachmentsFactory.makePrismaQuestionAttachments({
        attachmentId: attachment2.id,
        questionId: questionId
      })
    ])

    const attachment3 = await attachmentFactory.makePrismaAttachmens()

    const result = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New title",
        content: "New content",
        attachments: [
          attachment1.id.toString(),
          attachment3.id.toString(),
        ]
      });

    expect(result.statusCode).toEqual(204);

    const verify = await prisma.question.findFirst({
      where: {
        title: "New title",
        content: "New content",
      },
    });

    expect(verify).toBeTruthy();

    const findAttachments = await prisma.attachment.findMany({
      where: {
        questionId: questionId.toString()
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
