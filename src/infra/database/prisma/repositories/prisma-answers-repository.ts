import { Injectable } from '@nestjs/common'
import { PaginationParams } from '../../../../core/repositories/pagination-params'
import { AnswerRepository } from '../../../../domain/forum/application/repositories/answer-repository'
import { Answer } from '../../../../domain/forum/enterprise/entities/answer'
import { PrismaService } from '../prisma-service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findbyId(id: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: {
        id
      }
    })

    if(!answer) {
      return null
    }

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(data: Answer): Promise<void> {
    const _data = PrismaAnswerMapper.toPrisma(data)
    await this.prismaService.answer.create({
      data: _data
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)
    await this.prismaService.answer.update({
      data,
      where: {
        id: data.id
      }
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: {
        id: answer.id.toString()
      }
    })
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prismaService.answer.findMany({
      where: {
        questionId
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer))
  }
}
