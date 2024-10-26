import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer-use-case";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { InMemoryAnswersAttachmentsRepository } from "test/repositories/in-memory-answers-attachments-repository";
import { makeAnswerAttachments } from "test/factories/make-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit answer", () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersAttachmentsRepository,
    );
  });

  it("should be able edit a answer", async () => {
    const _makeAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("answerid-01"),
    );

    inMemoryAnswersRepository.create(_makeAnswer);

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachments({
        answerId: _makeAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachments({
        answerId: _makeAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      authorId: "authorid-01",
      content: "edit content",
      answerId: "answerid-01",
      attachments: ["1", "2"],
    });

    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
      ],
    );
  });

  it("should not be able to edit a answer from another user", async () => {
    const _makeAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("authorid-01"),
      },
      new UniqueEntityID("answerid-01"),
    );

    inMemoryAnswersRepository.create(_makeAnswer);

    const result = await sut.execute({
      authorId: "authorid-02",
      content: "edit content",
      answerId: "answerid-01",
      attachments: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachment when editing a answer', async () => {
    const answer = makeAnswer({
        authorId: new UniqueEntityID('author-1')
      },
      new UniqueEntityID('answer-01')
    )

    inMemoryAnswersRepository.items.push(answer)

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachments({
        attachmentId: new UniqueEntityID('1'),
        answerId: answer.id
      }),
      makeAnswerAttachments({
        attachmentId: new UniqueEntityID('2'),
        answerId: answer.id
      })
    )

    const result = await sut.execute({
      authorId: 'author-1',
      content: 'content question',
      answerId: 'answer-01',
      attachments: ['1','3']
    })

    expect(result.isRight()).toEqual(true)
    expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswersAttachmentsRepository.items).toEqual(
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
