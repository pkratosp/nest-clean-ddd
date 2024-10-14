import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionUseCase } from "./fetch-recent-question-use-case";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository 
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionUseCase;

describe("Fetch recent question", () => {
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
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to fetch recente question", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
    ]);
  });

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
