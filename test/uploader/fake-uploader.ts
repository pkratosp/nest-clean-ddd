import { Uploader, UploaderParams } from "@/domain/forum/application/storage/uploader";
import { randomUUID } from 'node:crypto'

interface Upload {
    fileName: string
    url: string
}

export class FakeUploader implements Uploader {
    public uploadFiles: Upload[] = []

    async upload({ fileName }: UploaderParams): Promise<{ url: string; }> {
        const url = randomUUID()

        this.uploadFiles.push({
            fileName: fileName,
            url: url
        })

        return {
            url
        }
    }
}