import { randomUUID } from 'crypto'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(id?: string) {
    this.value = id ?? randomUUID()
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
