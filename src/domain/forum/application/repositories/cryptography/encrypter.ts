export abstract class Encrypter {
  abstract encrypt(payloady: Record<string, unknown>): Promise<string>;
}
