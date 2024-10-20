import { UniqueEntityID } from "@/core/entities/unique-entity";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      content: faker.lorem.sentence(),
      title: faker.lorem.sentence(),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return notification;
}


@Injectable()
export class NotificationFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps>) {
    const _data = makeNotification(data)

    await this.prismaService.notifications.create({
      data: PrismaNotificationMapper.toPrisma(_data)
    })

    return _data
  }
}