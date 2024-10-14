import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/questions";
import { QuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

type RequestType = {
  slug: string;
};

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({ slug }: RequestType): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
