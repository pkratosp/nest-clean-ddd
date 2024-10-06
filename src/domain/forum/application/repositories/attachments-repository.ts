import { Attachement } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
    abstract create(attachment: Attachement): Promise<void>
}