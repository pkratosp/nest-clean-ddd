import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer-use-case";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryAnswersAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { makeAnswerAttachments } from "test/factories/make-answer-attachments";

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able delete a answer", async () => {
    const _makeAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("answer-01"),
    );

    inMemoryAnswersRepository.create(_makeAnswer);

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachments({
        answerId: _makeAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachments({
        answerId: _makeAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      answerId: "answer-01",
      authorId: "authorid-01",
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const _makeAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("answer-01"),
    );

    inMemoryAnswersRepository.create(_makeAnswer);

    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "authorid-02",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
