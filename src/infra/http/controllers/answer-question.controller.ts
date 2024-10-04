import { AnswerQuestionsUseCase } from "@/domain/forum/application/use-cases/answer-questions-use-case";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

const answerQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answer")
export class AnswerQuestionController {
  constructor(
    private readonly answerQuestionsUseCase: AnswerQuestionsUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async execute(
    @Body(bodyValidationPipe) answer: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string,
  ) {
    const result = await this.answerQuestionsUseCase.execute({
      content: answer.content,
      instructorId: user.sub,
      questionId: questionId,
      attachments: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
