import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { EditQuestionUseCase } from "./edit-question-use-case";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-questions-attachments-repository";
import { makeQuestionAttachments } from "test/factories/make-question-attachments";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit question", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsAttachmentsRepository,
    );
  });

  it("should be able edit a question", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachments({
        questionId: _makeQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachments({
        questionId: _makeQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      authorId: "authorid-01",
      content: "edit content",
      questionId: "questionid-01",
      title: "edit title",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "edit title",
      content: "edit content",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const _makeQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("questionid-01"),
    );

    inMemoryQuestionsRepository.create(_makeQuestion);

    const result = await sut.execute({
      authorId: "authorid-02",
      content: "edit content",
      questionId: "questionid-01",
      title: "edit title",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachment when editing a question', async () => {
    const question = makeQuestion({
        authorId: new UniqueEntityID('author-1')
      },
      new UniqueEntityID('question-01')
    )

    inMemoryQuestionsRepository.items.push(question)

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID('1'),
        questionId: question.id
      }),
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID('2'),
        questionId: question.id
      })
    )

    const result = await sut.execute({
      authorId: 'author-1',
      content: 'content question',
      questionId: 'question-01',
      title: 'title question',
      attachmentsIds: ['1','3']
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionsAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1')
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3')
        })
      ])
    )
  })
});
