import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/questions";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { InMemoryStudantsRepository } from "./in-memory-studants-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryQuestionsAttachmentsRepository } from "./in-memory-questions-attachments-repository";

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionsAttachmentsRepository,
    private studentsRepository: InMemoryStudantsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository
  ) {}

  async findbyId(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const findIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(findIndex, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async findManyRecent(params: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20);

    return questions;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }
    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })
    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist.`,
      )
    }
    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )
    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })
      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
        )
      }
      return attachment
    })
    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }
}
