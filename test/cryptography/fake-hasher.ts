import { HashCompare } from "@/domain/forum/application/repositories/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/repositories/cryptography/hash-generator";

export class FakeHasher implements HashCompare, HashGenerator {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat("-hashed") === hash;
  }

  async generate(plain: string): Promise<string> {
    return plain.concat("-hashed");
  }
}
