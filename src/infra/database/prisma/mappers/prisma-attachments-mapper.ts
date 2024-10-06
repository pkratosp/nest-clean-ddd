import { Attachement } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "@prisma/client";

export class PrismaAttachmentsMapper {
    static toPrisma(attachment: Attachement) : Prisma.AttachmentUncheckedCreateInput {
        return {
            title: attachment.title,
            url: attachment.url,
            id: attachment.id.toString()
        }
    }
}