import { UniqueEntityID } from '@/core/entities/unique-entity'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
    Question as PrismaQuestion,
    User as PrismaUser,
    Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentsMapper } from './prisma-attachments-mapper'


type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser | null
    Attachments: PrismaAttachment[]
}


export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        return QuestionDetails.create({
            attachments: raw.Attachments.map(PrismaAttachmentsMapper.toDomain),
            authorId: new UniqueEntityID(raw.author?.id),
            authorName: raw.author?.name!,
            content: raw.content,
            createdAt: raw.createdAt,
            questionId: new UniqueEntityID (raw.id),
            slug: Slug.create(raw.slug),
            title: raw.title,
            bestAnswerId: raw.bestAnswerId
            ? new UniqueEntityID(raw.bestAnswerId)
            : null,
            updatedAt: raw.updatedAt
        })
    }
}