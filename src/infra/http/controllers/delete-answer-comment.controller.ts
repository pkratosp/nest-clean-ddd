import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
    constructor(
        private readonly deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase
    ) {}

    @Delete()
    @HttpCode(204)
    async execute(
        @Param('id') id: string,
        @CurrentUser() user: UserPayload
    ) {
        const result = await this.deleteAnswerCommentUseCase.execute({
            answerId: id,
            authorId: user.sub
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}