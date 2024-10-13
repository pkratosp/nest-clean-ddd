import { UniqueEntityID } from "@/core/entities/unique-entity";
import { InMemoryQuestionsCommentRepository } from "test/repositories/in-memory-questions-comment-repository";
import { FetchQuestionCommentUseCase } from "./fetch-question-comment-use-case";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudantsRepository } from "test/repositories/in-memory-studants-repository";
import { makeStudant } from "test/factories/make-studant";

let inMemoryStudantsRepository: InMemoryStudantsRepository
let inMemoryQuestionsCommentRepository: InMemoryQuestionsCommentRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch question comment by question", () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    inMemoryQuestionsCommentRepository =
      new InMemoryQuestionsCommentRepository(inMemoryStudantsRepository);
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionsCommentRepository);
  });

  it("should be able to fetch question comments", async () => {
    const studant = makeStudant({ name: 'jhon doe' })

    inMemoryStudantsRepository.items.push(studant)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: studant.id
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: studant.id
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("question-1"),
      authorId: studant.id
    })

    await inMemoryQuestionsCommentRepository.create(comment1);
    await inMemoryQuestionsCommentRepository.create(comment2);
    await inMemoryQuestionsCommentRepository.create(comment3);

    const result = await sut.execute({
      questionId: "question-1",
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

  it("should be able to fetch paginated question comments", async () => {
    const studant = makeStudant()

    inMemoryStudantsRepository.items.push(studant)

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionsCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question-1"),
          authorId: studant.id
        }),
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
