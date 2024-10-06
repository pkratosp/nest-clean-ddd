import { Either, left, right } from "@/core/either"
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error"
import { Attachement } from "../../enterprise/entities/attachment"
import { AttachmentsRepository } from "../repositories/attachments-repository"
import { Uploader } from "../storage/uploader"
import { Injectable } from "@nestjs/common"

type UploadAndCreateAttachmentUseCaseRequest = {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<InvalidAttachmentTypeError, {
    attachments: Attachement
}>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        private readonly attachmentRepository: AttachmentsRepository,
        private readonly uploader: Uploader
    ) {}

    async execute({
        body,
        fileName,
        fileType
    }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {

        if(!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType))
        }

        const upload = await this.uploader.upload({
            body,
            fileName,
            fileType
        })

        const attachment = Attachement.create({
            title: fileName,
            url: upload.url
        })


        await this.attachmentRepository.create(attachment)
        
        return right({
            attachments: attachment
        })
    }
}