import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { StudantsRepository } from '../repositories/studants-repository'
import { Encrypter } from '../repositories/cryptography/encrypter'
import { HashCompare } from '../repositories/cryptography/hash-compare'

export interface AuthenticateStudantRequest {
  email: string
  password: string
}

type AuthenticateStudantResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateStudant {
  constructor(
    private readonly studantsRepository: StudantsRepository,
    private readonly encrypter: Encrypter,
    private readonly hashCompare: HashCompare,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudantRequest): Promise<AuthenticateStudantResponse> {
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
