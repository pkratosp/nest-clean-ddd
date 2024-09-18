import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudantsRepository } from 'test/repositories/in-memory-studants-repository'
import { AuthenticateStudantUseCase } from './authenticate-studant-use-case'
import { makeStudant } from 'test/factories/make-studant'

let inMemoryStudantsRepository: InMemoryStudantsRepository
let fakeHahser: FakeHasher
let fakeJwt: FakeEncrypter
let sut: AuthenticateStudantUseCase

describe('Authenticate studant', () => {
  beforeEach(() => {
    inMemoryStudantsRepository = new InMemoryStudantsRepository()
    fakeHahser = new FakeHasher()
    fakeJwt = new FakeEncrypter()
    sut = new AuthenticateStudantUseCase(
      inMemoryStudantsRepository,
      fakeJwt,
      fakeHahser,
    )
  })

  it('should be able to authenticate a studant', async () => {
    const studant = makeStudant({
      email: 'jhondoe@email.com',
      name: 'jhon',
      password: await fakeHahser.generate('12345'),
    })

    inMemoryStudantsRepository.items.push(studant)

    const login = await sut.execute({
      email: 'jhondoe@email.com',
      password: '12345',
    })

    expect(login.isRight()).toEqual(true)
    expect(login.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
