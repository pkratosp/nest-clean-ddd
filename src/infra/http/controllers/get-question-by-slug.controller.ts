import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug-use-case";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { QuestionPresenter } from "../presenter/question-presenter";
import { QuestionDetailsPresenter } from "../presenter/question-details-presenter";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  async execute(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({
      slug: slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      question: QuestionDetailsPresenter.toHttp(result.value.question),
    };
  }
}
