import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

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
  )

  return notification
}
