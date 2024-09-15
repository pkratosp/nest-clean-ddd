import { Question } from '@/domain/forum/enterprise/entities/questions'

export class QuestionPresenter {
  static toHttp(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswer: question.bestAnswerId?.toString,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
