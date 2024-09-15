import { Studant } from '../../enterprise/entities/studants'

export abstract class StudantsRepository {
  abstract findByEmail(email: string): Promise<Studant>
  abstract create(studant: Studant): Promise<void>
}
