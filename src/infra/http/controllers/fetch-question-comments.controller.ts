import { FetchQuestionCommentUseCase } from "@/domain/forum/application/use-cases/fetch-question-comment-use-case";
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

@Controller('/questions/commnets/:questionId')
export class FetchQuestionCommentsController {
    constructor(
        private readonly fetchQuestionCommentUseCase: FetchQuestionCommentUseCase
    ) {}

    @Get()
    @HttpCode(200)
    async execute(
        @Param('questionId') questionId: string,
        @Query('page', queryValidationPipe) page: PageQueryParamSchema
    ) {
        const result = await this.fetchQuestionCommentUseCase.execute({
            page,
            questionId
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }

        return {
            comments: result.value.comments.map(CommentsPresenter.toHttp)
        }
    }
}