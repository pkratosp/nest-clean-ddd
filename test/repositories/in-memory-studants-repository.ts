import { StudantsRepository } from '@/domain/forum/application/repositories/studants-repository'
import { Studant } from '@/domain/forum/enterprise/entities/studants'

export class InMemoryStudantsRepository implements StudantsRepository {
  public items: Studant[] = []

  async findByEmail(email: string): Promise<Studant | null> {
    const find = this.items.find((studant) => studant.email === email)

    if (!find) {
      return null
    }

    return find
  }

  async create(studant: Studant): Promise<void> {
    this.items.push(studant)
  }
}
