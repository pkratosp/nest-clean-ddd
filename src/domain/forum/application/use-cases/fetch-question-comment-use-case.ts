import { Either, right } from "@/core/either";
import { QuestionCommentRepository } from "../repositories/question-comment-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";

type FetchQuestionCommentUseCaseRequest = {
    questionId: string
    page: number
}


type FetchQuestionCommentUseCaseResponse = Either<null, {
    comments: QuestionComment[]
}>

@Injectable()
export class FetchQuestionCommentUseCase {
    constructor(
        private readonly questionCommentRepository: QuestionCommentRepository
    ) {}

    async execute({ 
        page,
        questionId    
    }: FetchQuestionCommentUseCaseRequest): Promise<FetchQuestionCommentUseCaseResponse> {
        const questionComments = await this.questionCommentRepository.findManyByQuestionIdWithouAuthor(
            questionId,
            {
                page
            }
        )

        return right({
            comments: questionComments
        })
    }
}