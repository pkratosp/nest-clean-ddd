import { Either, left, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { AnswerRepository } from "../repositories/answer-repository";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Injectable } from "@nestjs/common";

type RequestType = {
  authorId: string;
  answerId: string;
  content: string;
};

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answerCommentRepository: AnswerCommentRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({
    authorId,
    content,
    answerId,
  }: RequestType): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findbyId(answerId.toString());

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      content,
      answerId: new UniqueEntityID(answerId),
    });

    await this.answerCommentRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
