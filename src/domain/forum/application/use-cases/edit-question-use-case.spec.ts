import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question-use-case";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { makeQuestionAttachments } from "test/factories/make-question-attachments";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit question", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsAttachmentsRepository,
    );
  });

  it("should be able edit a question", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachments({
        questionId: _makeQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachments({
        questionId: _makeQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      authorId: "authorid-01",
      content: "edit content",
      questionId: "questionid-01",
      title: "edit title",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "edit title",
      content: "edit content",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    const result = await sut.execute({
      authorId: "authorid-02",
      content: "edit content",
      questionId: "questionid-01",
      title: "edit title",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
