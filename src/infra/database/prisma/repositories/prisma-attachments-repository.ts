import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachement } from "@/domain/forum/enterprise/entities/attachment";
import { PrismaService } from "../prisma-service";
import { PrismaAttachmentsMapper } from "../mappers/prisma-attachments-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
    constructor(private readonly prisma: PrismaService) {}
    
    async create(attachment: Attachement): Promise<void> {
        const data = PrismaAttachmentsMapper.toPrisma(attachment)
        await this.prisma.attachment.create({
            data
        })
    }
}