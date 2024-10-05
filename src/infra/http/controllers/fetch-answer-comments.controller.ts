import { FetchAnswerCommentUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comment-use-case";
import { BadRequestException, Controller, Get, HttpCode, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CommentsPresenter } from "../presenter/comments-presenter";

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/comments/:answerId')
export class FetchAnswerCommensController {
    constructor(
        private readonly fetchAnswerCommentUseCase: FetchAnswerCommentUseCase
    ) {}

    @Get()
    @HttpCode(200)
    async execute(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('answerId') answerId: string
    ) {
        const result = await this.fetchAnswerCommentUseCase.execute({
            answerId,
            page
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return {
            comments: result.value.answersComment.map(CommentsPresenter.toHttp)
        }
    }
}