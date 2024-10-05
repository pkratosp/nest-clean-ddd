import { UniqueEntityID } from "@/core/entities/unique-entity";
import { InMemoryAnswersCommentRepository } from "test/repositories/in-memory-answers-comment-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { FetchAnswerCommentUseCase } from "./fetch-answer-comment-use-case";

let inMemoryAnswersCommentRepository: InMemoryAnswersCommentRepository;
let sut: FetchAnswerCommentUseCase;

describe("Fetch answer comment by answer", () => {
  beforeEach(() => {
    inMemoryAnswersCommentRepository =
      new InMemoryAnswersCommentRepository();
    sut = new FetchAnswerCommentUseCase(inMemoryAnswersCommentRepository);
  });

  it("should be able to fetch answer comments", async () => {
    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.value?.answersComment).toHaveLength(3);
  });

  it("should be able to fetch paginated answers comments", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
        }),
      );
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(result.value?.answersComment).toHaveLength(2);
  });
});
