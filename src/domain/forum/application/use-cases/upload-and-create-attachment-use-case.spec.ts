import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository"
import { FakeUploader } from "test/uploader/fake-uploader"
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment-use-case"
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error"

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload file attachment', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        fakeUploader = new FakeUploader()
        sut = new UploadAndCreateAttachmentUseCase(inMemoryAttachmentsRepository,fakeUploader)
    })

    it('should be able to update and create attachment', async () => {
        const result = await sut.execute({
            body: Buffer.from(''),
            fileName: 'file.png',
            fileType: 'image/png'
        })

        expect(result.isRight())
        expect(result.value).toEqual({
            attachments: inMemoryAttachmentsRepository.items[0]
        })
        expect(fakeUploader.uploadFiles).toHaveLength(1)
        expect(fakeUploader.uploadFiles[0]).toEqual(
            expect.objectContaining({
                fileName: 'file.png'
            })
        )
    })

    it('should not be able to upload an attachment with invalid file type', async () => {
        const result = await sut.execute({
            body: Buffer.from(''),
            fileName: 'file.mp3',
            fileType: 'audio/mp3'
        })

        expect(result.isLeft()).toEqual(true)
        expect(inMemoryAttachmentsRepository.items).toHaveLength(0)
        expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
    })
})