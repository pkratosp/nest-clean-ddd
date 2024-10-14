import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug-use-case";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudant } from "test/factories/make-studant";
import { makeAttachments } from "test/factories/make-attachments";
import { makeQuestionAttachments } from "test/factories/make-question-attachments";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository 
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

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
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question", async () => {
    const studant = makeStudant({ name: 'jhon doe' })

    inMemoryStudantsRepository.items.push(studant)

    const createQuestion = makeQuestion({
      slug: Slug.create("example-question"),
      authorId: studant.id
    });

    await inMemoryQuestionsRepository.create(createQuestion);

    const attachment = makeAttachments({
      title: 'title attachment'
    })

    inMemoryAttachmentsRepository.items.push(attachment)

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachments({
        attachmentId: attachment.id,
        questionId: createQuestion.id
      })
    )

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: createQuestion.title,
        authorName: 'jhon doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title
          })
        ]        
      }),
    })
  });
});
