import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRepository } from '../repositories/notification-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity'

type RequestType = {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    content,
    recipientId,
    title,
  }: RequestType): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityID(recipientId),
      title,
    })

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
