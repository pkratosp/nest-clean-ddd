import { Attachement } from "@/domain/forum/enterprise/entities/attachment";

export class AttachmentPresenter {
    static toHttp(attachment: Attachement) {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url
        }
    }
}