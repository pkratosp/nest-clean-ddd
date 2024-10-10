import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachments";

describe("Create question (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AttachmentFactory
      ]
    }).compile();

    app = moduleRef.createNestApplication();

    attachmentFactory = moduleRef.get(AttachmentFactory)
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const attachment1 = await attachmentFactory.makePrismaAttachmens()
    const attachment2 = await attachmentFactory.makePrismaAttachmens()

    const token = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New question",
        content: "Question content",
        attachments: [
          attachment1.id.toString(),
          attachment2.id.toString()
        ]
      });

    expect(response.statusCode).toEqual(201);

    const questionOnDataBase = await prisma.question.findFirst({
      where: {
        title: "New question",
      },
    });

    expect(questionOnDataBase).toBeTruthy();
  
  
    const findAttachmentByQuestion = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDataBase?.id
      }
    })

    expect(findAttachmentByQuestion).toHaveLength(2)
  });
});
