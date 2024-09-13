import { Injectable } from '@nestjs/common'
import { AnswerCommentRepository } from '../../../../domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '../../../../domain/forum/enterprise/entities/answer-comment'

@Injectable()
export class PrismaAnswersCommentRepository implements AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.')
  }

  create(data: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(data: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
