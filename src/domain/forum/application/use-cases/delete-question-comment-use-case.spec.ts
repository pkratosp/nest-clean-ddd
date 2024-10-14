import { UniqueEntityID } from "@/core/entities/unique-entity";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment-use-case";
import { InMemoryQuestionsCommentRepository } from "test/repositories/in-memory-questions-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryQuestionsCommentRepository: InMemoryQuestionsCommentRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment use case", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryQuestionsCommentRepository =
      new InMemoryQuestionsCommentRepository(inMemoryStudantsRepository);
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentRepository);
  });

  it("should be able delete a question comment", async () => {
    const _makeQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionId-01"),
    );

    inMemoryQuestionsCommentRepository.create(_makeQuestionComment);

    await sut.execute({
      authorId: "authorid-01",
      questionId: "questionId-01",
    });

    expect(inMemoryQuestionsCommentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question comment from another user", async () => {
    const _makeQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionId-01"),
    );

    inMemoryQuestionsCommentRepository.create(_makeQuestionComment);

    const result = await sut.execute({
      authorId: "authorid-02",
      questionId: "questionId-01",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
