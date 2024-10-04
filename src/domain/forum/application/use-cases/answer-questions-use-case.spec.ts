import { InMemoryAnswersAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { AnswerQuestionsUseCase } from "./answer-questions-use-case";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionsUseCase;

describe("Answer questions", () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    sut = new AnswerQuestionsUseCase(inMemoryAnswersRepository);
  });

  it("should be able to create an answer question", async () => {
    const result = await sut.execute({
      content: "nova resposta",
      instructorId: "1",
      questionId: "1",
      attachments: ["1", "2"],
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answer.content).toEqual("nova resposta");
    expect(inMemoryAnswersRepository.items[0].id).toEqual(
      result.value?.answer.id,
    );
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
  });
});
