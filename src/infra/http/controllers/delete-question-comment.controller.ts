import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
    constructor(
        private readonly deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
    ) {}


    @Delete()
    @HttpCode(204)
    async execute(
        @Param('id') id: string,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.deleteQuestionCommentUseCase.execute({
            authorId: user.sub,
            questionId: id
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}