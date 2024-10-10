import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Question } from "../../enterprise/entities/questions";
import { QuestionRepository } from "../repositories/question-repository";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { Either, right } from "@/core/either";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

type RequestType = {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: RequestType): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    });

    const questionAttachment = attachmentsIds.map((attachmentid) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentid),
        questionId: question.id,
      });
    });

    question.attachments = new QuestionAttachmentList(questionAttachment);

    console.log(question.attachments)
    console.log('antes do meu respository')
    await this.questionRepository.create(question);

    return right({
      question,
    });
  }
}
