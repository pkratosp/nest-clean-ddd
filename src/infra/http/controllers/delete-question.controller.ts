import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller('/questions/:id')
export class DeleteQuestionController {
    constructor(
        private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
    ) {}

    @Delete()
    @HttpCode(204)
    async execute(
        @Param('id') id: string,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.deleteQuestionUseCase.execute({
            authorId: user.sub,
            questionId: id
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}