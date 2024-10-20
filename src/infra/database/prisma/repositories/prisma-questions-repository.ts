import { Injectable } from "@nestjs/common";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/questions";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { PrismaService } from "../prisma-service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cacheRepository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheRepository: CacheRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findbyId(id: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

    if(cacheHit) {
      const cacheData = JSON.parse(cacheHit)

      return cacheData
    }

    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        Attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails)
    )

    return questionDetails
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prismaService.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    )
 
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prismaService.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
      this.cacheRepository.delete(`question:${question.slug}:details`)
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    await this.prismaService.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }
}
