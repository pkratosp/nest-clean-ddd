import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity";

interface AttachementProps {
  title: string;
  url: string;
}

export class Attachement extends Entity<AttachementProps> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  static create(props: AttachementProps, id?: UniqueEntityID) {
    const attachement = new Attachement(props, id);

    return attachement;
  }
}
