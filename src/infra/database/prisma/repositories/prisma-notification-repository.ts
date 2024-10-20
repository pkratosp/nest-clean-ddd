import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../../../domain/notification/application/repositories/notification-repository";
import { Notification } from "../../../../domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { PrismaService } from "../prisma-service";

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prismaService.notifications.findUnique({
      where: {
        id
      }
    })

    if(!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prismaService.notifications.create({
      data
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prismaService.notifications.update({
      data,
      where: {
        id: data.id?.toString()
      }
    })
  }
}
