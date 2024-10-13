import { InMemoryAnswersAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { AnswerQuestionsUseCase } from "./answer-questions-use-case";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity";

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

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      content: 'conteudo da mensagem',
      attachments: ['1','2','3'],
      questionId: '1'
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(3)
    expect(inMemoryAnswersAttachmentsRepository.items).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1')
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2')
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('3')
      })
    ])
  })
});
