import { HashCompare } from "@/domain/forum/application/repositories/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/repositories/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashCompare {
  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }

  async generate(plain: string): Promise<string> {
    return await hash(plain, 8);
  }
}
