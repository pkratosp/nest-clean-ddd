import { InMemoryAnswersCommentRepository } from "test/repositories/in-memory-answers-comment-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer-use-case";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersCommentRepository: InMemoryAnswersCommentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on answer use case", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersCommentRepository = new InMemoryAnswersCommentRepository(inMemoryStudantsRepository);
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersCommentRepository,
      inMemoryAnswersRepository,
    );
  });

  it("should be able to answer on question", async () => {
    const answer = makeAnswer();

    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      authorId: answer.authorId.toString(),
      content: "content comment",
      answerId: answer.id.toString(),
    });

    expect(inMemoryAnswersCommentRepository.items[0].content).toEqual(
      "content comment",
    );
  });
});
