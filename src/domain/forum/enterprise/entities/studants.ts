import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'

export interface StudantsProps {
  name: string
  email: string
  password: string
}

export class Studant extends Entity<StudantsProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudantsProps, id?: UniqueEntityID) {
    const studant = new Studant(props, id)

    return studant
  }
}
