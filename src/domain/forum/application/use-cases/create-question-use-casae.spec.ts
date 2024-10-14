import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question-use-case";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository 
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create question", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
      inMemoryStudantsRepository,
      inMemoryAttachmentsRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      content: "conteudo da mensagem",
      title: "questao",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question,
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
  });

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      content: 'conteudo da mensagem',
      title: 'questao',
      attachmentsIds: ['1','2','3']
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(3)
    expect(inMemoryQuestionsAttachmentsRepository.items).toEqual([
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
