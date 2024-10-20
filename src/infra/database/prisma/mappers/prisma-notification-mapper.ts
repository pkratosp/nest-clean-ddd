import { UniqueEntityID } from '@/core/entities/unique-entity';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Notifications, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
    static toDomain(notification: Notifications): Notification {
        return Notification.create({
            content: notification.content,
            recipientId: new UniqueEntityID(notification.recipentId),
            title: notification.title,
            createdAt: notification.createdAt,
            readAt: notification.readAt
        }, new UniqueEntityID(notification.id))
    }

    static toPrisma(notification: Notification): Prisma.NotificationsUncheckedCreateInput {
        return {
            content: notification.content,
            recipentId: notification.recipientId.toString(),
            title: notification.title,
            createdAt: notification.createdAt,
            id: notification.id.toString(),
            readAt: notification.readAt
        }
    }
}