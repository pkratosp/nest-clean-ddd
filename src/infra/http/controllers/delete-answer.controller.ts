import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private readonly deleteAnswerUseCase: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async execute(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const result = await this.deleteAnswerUseCase.execute({
      answerId: id,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
