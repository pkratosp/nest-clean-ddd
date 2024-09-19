import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { StudantsRepository } from '../repositories/studants-repository'
import { Encrypter } from '../repositories/cryptography/encrypter'
import { HashCompare } from '../repositories/cryptography/hash-compare'
import { Injectable } from '@nestjs/common'

export interface AuthenticateStudantUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudantUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudantUseCase {
  constructor(
    private readonly studantsRepository: StudantsRepository,
    private readonly encrypter: Encrypter,
    private readonly hashCompare: HashCompare,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudantUseCaseRequest): Promise<AuthenticateStudantUseCaseResponse> {
    const studant = await this.studantsRepository.findByEmail(email)

    if (!studant) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      studant.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: studant.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
