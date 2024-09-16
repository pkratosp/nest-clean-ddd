import { Encrypter } from '@/domain/forum/application/repositories/cryptography/encrypter'

export class fakeEncrypter implements Encrypter {
  async encrypt(payloady: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payloady)
  }
}
