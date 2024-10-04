import { Either, left, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { QuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Injectable } from "@nestjs/common";

type RequestType = {
  authorId: string;
  questionId: string;
  content: string;
};

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: RequestType): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findbyId(
      questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      questionId: new UniqueEntityID(questionId),
    });

    await this.questionCommentRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
