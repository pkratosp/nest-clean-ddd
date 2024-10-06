import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachement } from "@/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
    public items: Attachement[] = []

    async create(attachment: Attachement): Promise<void> {
        this.items.push(attachment)
    }
}