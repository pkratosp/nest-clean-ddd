import { Injectable } from '@nestjs/common'
import { QuestionCommentRepository } from '../../../../domain/forum/application/repositories/question-comment-repository'
import { QuestionComment } from '../../../../domain/forum/enterprise/entities/question-comment'

@Injectable()
export class PrismaQuestionsCommentRepository
  implements QuestionCommentRepository
{
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }

  create(data: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(data: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
