import { Either, right } from "@/core/either";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";

type FetchAnswerCommentUseCaseRequest = {
    answerId: string
    page: number
}

type FetchAnswerCommentUseCaseResponse = Either<null, {
    answersComment: AnswerComment[]
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
        const answersComments = await this.answerCommentRepository.findManyByAnswerId(answerId, {
            page
        })

        return right({
            answersComment: answersComments
        })
    }
}