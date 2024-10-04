import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
  recipientId: UniqueEntityID;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get readAt() {
    return this.props.readAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
