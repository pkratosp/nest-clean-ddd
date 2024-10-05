import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const commentOnAnswerBodySchema = z.object({
    content: z.string()
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
    constructor(
        private readonly commentOnAnswerUseCase: CommentOnAnswerUseCase
    ) {}

    @Post()
    @HttpCode(204)
    async execute(
        @Body() body: CommentOnAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('answerId') answerId: string
    ) {
        const result = await this.commentOnAnswerUseCase.execute({
            answerId,
            authorId: user.sub,
            content: body.content
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }

    }
}