import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question-use-case";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete question", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able delete a question", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    await sut.execute({
      authorId: "authorid-01",
      questionId: "questionid-01",
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    const result = await sut.execute({
      authorId: "authorid-02",
      questionId: "questionid-01",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
