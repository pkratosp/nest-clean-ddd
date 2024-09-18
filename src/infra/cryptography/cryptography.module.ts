import { Encrypter } from '@/domain/forum/application/repositories/cryptography/encrypter'
import { Module } from '@nestjs/common'
import { JwtEncrypt } from './jwt-encrypt'
import { BcryptHasher } from './bcrypt-hasher'
import { HashCompare } from '@/domain/forum/application/repositories/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/repositories/cryptography/hash-generator'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypt,
    },
    {
      provide: HashCompare,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashCompare, HashGenerator],
})
export class CryptographyModule {}
