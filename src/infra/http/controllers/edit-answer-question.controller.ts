import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editAnswerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string()).default([])
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerQuestionBodySchema);

type EditAnswerQuestionBodySchema = z.infer<
  typeof editAnswerQuestionBodySchema
>;

@Controller("/answers/:id")
export class EditAnswerQuestionController {
  constructor(private readonly editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  async execute(
    @Body(bodyValidationPipe) body: EditAnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") id: string,
  ) {
    const result = await this.editAnswerUseCase.execute({
      content: body.content,
      answerId: id,
      attachments: body.attachments,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
