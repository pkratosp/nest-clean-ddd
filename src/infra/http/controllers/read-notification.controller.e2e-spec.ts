import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/make-notification";
import { StudantFactory } from "test/factories/make-studant";

describe("read notification controller (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studantFactory: StudantFactory;
  let notificationFactory: NotificationFactory;
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudantFactory,
        NotificationFactory
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studantFactory = moduleRef.get(StudantFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    prisma = moduleRef.get(PrismaService)
    
    await app.init();
  });

  test("[PATCH] /notifications/:notificationId", async () => {
    const user = await studantFactory.makePrismaStudant();

    const token = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
        recipientId: user.id
    })
    
    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const notificationOnDatabse = await prisma.notifications.findFirst({
        where: {
            recipentId: user.id.toString()
        }
    })

    expect(notificationOnDatabse).toBeTruthy()
    
  });
});
