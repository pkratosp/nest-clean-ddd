import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Attachement, AttachementProps } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentsMapper } from "@/infra/database/prisma/mappers/prisma-attachments-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma-service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAttachments(
    override: Partial<AttachementProps>,
    id?: UniqueEntityID
) {
    const createAttachment = Attachement.create({
            title: faker.lorem.slug(),
            url: faker.lorem.slug(),
            ...override
        }, 
        id
    )

    return createAttachment
}

@Injectable()
export class AttachmentFactory {
    constructor(
        private readonly prismaService: PrismaService
    ){}

    async makePrismaAttachmens(data: Partial<AttachementProps> = {}) {
        const attachment = makeAttachments(data)

        await this.prismaService.attachment.create({
            data: PrismaAttachmentsMapper.toPrisma(attachment)
        })

        return attachment
    }
}