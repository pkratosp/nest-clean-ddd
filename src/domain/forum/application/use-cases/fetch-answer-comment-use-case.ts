import { Either, right } from "@/core/either";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

type FetchAnswerCommentUseCaseRequest = {
    answerId: string
    page: number
}

type FetchAnswerCommentUseCaseResponse = Either<null, {
    comments: CommentWithAuthor[]
}>

@Injectable()
export class FetchAnswerCommentUseCase {
    constructor(
        private readonly answerCommentRepository: AnswerCommentRepository
    ) {}

    async execute({
        answerId,
        page
    }: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
        const answersComments = await this.answerCommentRepository.findManyByAnswerIdWithAuthor(answerId, {
            page
        })

        return right({
            comments: answersComments
        })
    }
}