import { Injectable } from '@nestjs/common'
import { NotificationRepository } from '../../../../domain/notification/application/repositories/notification-repository'
import { Notification } from '../../../../domain/notification/enterprise/entities/notification'

@Injectable()
export class PrimaNotificationRepository implements NotificationRepository {
  findById(id: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }

  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
