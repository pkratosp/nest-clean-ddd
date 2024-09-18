import { Encrypter } from '@/domain/forum/application/repositories/cryptography/encrypter'
import { JwtService } from '@nestjs/jwt'

export class JwtEncrypt implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payloady: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payloady)
  }
}
