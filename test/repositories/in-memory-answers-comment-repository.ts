import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comment-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswersCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  async create(data: AnswerComment) {
    this.items.push(data)
  }

  async findById(id: string) {
    const find = this.items.find((item) => item.id.toString() === id)

    return find ?? null
  }

  async delete(data: AnswerComment) {
    const itemIndex = this.items.findIndex((item) => item.id === data.id)

    this.items.splice(itemIndex, 1)
  }
}
