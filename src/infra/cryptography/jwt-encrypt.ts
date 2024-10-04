import { Encrypter } from "@/domain/forum/application/repositories/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtEncrypt implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payloady: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payloady);
  }
}
