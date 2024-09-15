import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../repositories/cryptography/hash-generator'
import { StudantsRepository } from '../repositories/studants-repository'
import { StudantAlreadyExistsError } from './errors/student-already-exists-error'
import { Studant } from '../../enterprise/entities/studants'

export interface RegisterStudantsUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudantsUseCaseResponse = Either<
  StudantAlreadyExistsError,
  {
    studant: Studant
  }
>

export class RegisterStudantsUseCase {
  constructor(
    private readonly studantsRepository: StudantsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudantsUseCaseRequest): Promise<RegisterStudantsUseCaseResponse> {
    const studantWithSameEmail =
      await this.studantsRepository.findByEmail(email)

    if (studantWithSameEmail) {
      return left(new StudantAlreadyExistsError(email))
    }

    const hashPassword = await this.hashGenerator.generate(password)

    const studant = Studant.create({
      email,
      name,
      password: hashPassword,
    })

    await this.studantsRepository.create(studant)

    return right({
      studant,
    })
  }
}
