import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AnswerPresenter } from "../presenter/answer-presenter";

const querySchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const querySchemaValidation = new ZodValidationPipe(querySchema);

type QuerySchema = z.infer<typeof querySchema>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async execute(
    @Query("page", querySchemaValidation) page: QuerySchema,
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({
      page: page,
      questionId: questionId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return { answers: result.value.answers.map(AnswerPresenter.toHttp) };
  }
}
