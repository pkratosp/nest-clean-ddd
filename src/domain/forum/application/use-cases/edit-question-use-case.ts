import { Either, left, right } from "@/core/either";
import { QuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { Injectable } from "@nestjs/common";

type RequestType = {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
};

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
    title,
    attachmentsIds,
  }: RequestType): Promise<EditQuestionUseCaseResponse> {
    const findQuestion = await this.questionRepository.findbyId(questionId);

    if (!findQuestion) {
      return left(new ResourceNotFoundError());
    }

    if (findQuestion.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachementId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachementId),
        questionId: findQuestion.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    findQuestion.title = title;
    findQuestion.content = content;
    findQuestion.attachments = questionAttachmentList;

    await this.questionRepository.save(findQuestion);

    return right(null);
  }
}
