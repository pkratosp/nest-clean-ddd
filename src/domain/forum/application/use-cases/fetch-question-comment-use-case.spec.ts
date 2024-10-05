import { UniqueEntityID } from "@/core/entities/unique-entity";
import { InMemoryQuestionsCommentRepository } from "test/repositories/in-memory-questions-comment-repository";
import { FetchQuestionCommentUseCase } from "./fetch-question-comment-use-case";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionsCommentRepository: InMemoryQuestionsCommentRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch question comment by question", () => {
  beforeEach(() => {
    inMemoryQuestionsCommentRepository =
      new InMemoryQuestionsCommentRepository();
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionsCommentRepository);
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID("question-1"),
      }),
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
  });

  it("should be able to fetch paginated question comments", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
        }),
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
