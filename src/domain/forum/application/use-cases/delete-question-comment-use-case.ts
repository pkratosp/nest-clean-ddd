import { Either, left, right } from "@/core/either";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

type RequestType = {
  authorId: string;
  questionId: string;
};

type DeleteQuestionCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentRepository) {}

  async execute({
    authorId,
    questionId,
  }: RequestType): Promise<DeleteQuestionCommentUseCaseResponse> {
    const question = await this.questionCommentRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentRepository.delete(question);

    return right(null);
  }
}
