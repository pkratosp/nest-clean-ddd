import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, HttpCode, Injectable, Param, Patch } from "@nestjs/common";

@Injectable()
@Controller('/notifications/:notificationId')
export class ReadNotificationController {
    constructor(
        private readonly readNotificationUseCase: ReadNotificationUseCase
    ) {}

    @Patch()
    @HttpCode(204)
    async execute(
        @CurrentUser() user: UserPayload,
        @Param('notificationId') notificationId: string
    ) {
        const result = await this.readNotificationUseCase.execute({
            notificationId: notificationId,
            recipientId: user.sub
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }

    }

}