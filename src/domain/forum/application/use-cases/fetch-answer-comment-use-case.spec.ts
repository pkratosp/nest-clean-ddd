import { UniqueEntityID } from "@/core/entities/unique-entity";
import { InMemoryAnswersCommentRepository } from "test/repositories/in-memory-answers-comment-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { FetchAnswerCommentUseCase } from "./fetch-answer-comment-use-case";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { makeStudant } from "test/factories/make-studant";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryAnswersCommentRepository: InMemoryAnswersCommentRepository;
let sut: FetchAnswerCommentUseCase;

describe("Fetch answer comment by answer", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryAnswersCommentRepository =
      new InMemoryAnswersCommentRepository(inMemoryStudantsRepository);
    sut = new FetchAnswerCommentUseCase(inMemoryAnswersCommentRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const studant = makeStudant({ name: 'jhon doe' })

    inMemoryStudantsRepository.items.push(studant)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: studant.id
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: studant.id
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: studant.id
    })

    await inMemoryAnswersCommentRepository.create(comment1);
    await inMemoryAnswersCommentRepository.create(comment2);
    await inMemoryAnswersCommentRepository.create(comment3);

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'jhon doe',
          commentId: comment1.id.toString()
        }),
        expect.objectContaining({
          author: 'jhon doe',
          commentId: comment2.id.toString()
        }),
        expect.objectContaining({
          author: 'jhon doe',
          commentId: comment3.id.toString()
        })
      ])
    )
  });

  it("should be able to fetch paginated answers comments", async () => {
    const studant = makeStudant({ name: 'jhon doe' })

    inMemoryStudantsRepository.items.push(studant)

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: studant.id
        }),
      );
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
