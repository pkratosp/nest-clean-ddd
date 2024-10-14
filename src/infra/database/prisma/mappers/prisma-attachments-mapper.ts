import { Attachment as PrismaAttachment } from "@prisma/client"
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

    static toDomain(raw: PrismaAttachment): Attachement {
        return Attachement.create({
            title: raw.title,
            url: raw.url
        })
    }
}